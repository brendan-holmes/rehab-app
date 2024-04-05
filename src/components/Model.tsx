import React from 'react';
import { AnnotationContainer } from './Annotation/AnnotationContainer';
import { Annotation } from '../types/Annotation';
import '@google/model-viewer/dist/model-viewer';
import { logInfo, logError } from '../logging';
import { Point2d } from '../types/Point2d';
import { toast } from 'react-toastify';
import { list, remove, put } from '../apiClient';
import { useEffect, useState, useRef } from 'react';
import { UNSAVED_ANNOTATION_ID } from './Annotation/annotationConstants';
import { calculateDistance } from '../utils/pointUtils';

export function Model () {
    const [annotationsData, setAnnotationsData] = useState<Annotation[]>([]);

    const modelRef = useRef<JSX.IntrinsicElements["model-viewer"]>();
    const [mouseDownCoords, setMouseDownCoords] = useState<Point2d | null>(null);

    const MODEL_FILE_URL = 'https://rehab-app-brendan-holmes-net.s3.ap-southeast-2.amazonaws.com/human-body-model.glb';

    useEffect(() => {
        fetchAnnotationsData();
    }, []);

    function fetchAnnotationsData() {
        list()
            .then((annotations: Annotation[]) => {
                logInfo(`Got data from api.list(): ${annotations}`, );
                setAnnotationsData(annotations);
            })
            .catch((error: Error) => toast(`Unable to refresh data: ${error}`));
        };

    function removeUnsavedAnnotation() {
        logInfo('Removing unsaved annotation...');
        setAnnotationsData(annotationsData.filter((annotation: Annotation) => annotation.id !== UNSAVED_ANNOTATION_ID));
    }

    function handleBackgroundClick() {
        removeUnsavedAnnotation();
    }

    function addNewAnnotation(dataPoint: Annotation) {
        logInfo(`Adding new annotation: ${dataPoint}`);

        // Every new annotation first gets a temporary id and then gets a real id when saved
        dataPoint.id = UNSAVED_ANNOTATION_ID;
        dataPoint.timestamp = new Date().toUTCString();
        setAnnotationsData([...annotationsData, dataPoint]);
    }

    function deleteAnnotation (event: React.MouseEvent, id: string) {
        if (event) {
            event.stopPropagation();

            logInfo(`Delete clicked on annotation with id: ${id}`);
            if (id) {
                if (id === UNSAVED_ANNOTATION_ID) {
                    removeUnsavedAnnotation();
                    return;
                }
        
                logInfo(`Deleting annotation with id: ${id}`);
                const name = annotationsData.filter((a: Annotation) => a.id === id)[0].name || 'injury';
                if (!window.confirm(`Delete ${name}?`)) {
                    logInfo(`Deletion cancelled by user with id: ${id}`);
                    return;
                }
                let newData;
                setAnnotationsData((existingAnnotations: Annotation[]) => {
                    logInfo(`Existing annotations: ${existingAnnotations}`);
                    newData = existingAnnotations.filter(annotation => annotation.id !== id);
                    logInfo(`Removed annotation with id: ${id}`);
                    logInfo(`New annotations: ${newData}`);
                    return newData;
                });
                remove(id)
                    .then((response: Response | null) => response?.json())
                    .then(() => toast("Deleted injury"))
                    .catch((error: Error) => {
                        logInfo(`An error occurred while deleting annotation: ${error}`);
                        toast(`Unable to delete`)
                    });
                return newData;
            }
        }
    }

    function persistAnnotation(annotation: Annotation) {
        if (!annotation.id) {
            logError('Attempting to persist an annotation that doesn\'t have a id.');
            return;
        }
        if (!annotation.name) {
            annotation.name = "Unnamed injury";
        }
        let newData;
        logInfo('Created ID: ', annotation.id);
    
        put(annotation, annotation.id)
            .then((response: Response) => response?.json())
    
            // todo
            .then((responseJson: any) => {
                logInfo(`Put data with api.put(). Response: ${responseJson}`);
                if (responseJson.errorMessage) {
                    throw new Error(responseJson.errorMessage)
                }
                toast("Added injury");
            })
            .catch((error: Error) => toast(`An error occurred: ${error}`));
        fetchAnnotationsData();
        removeUnsavedAnnotation();
        return newData;
    };

    // Used to determine if a click is a drag or a click
    function handleMouseDown (event: React.MouseEvent) {
        logInfo(`Mouse down event. Setting mouse down coords to: ${{x: event.clientX, y: event.clientY}}`);
        setMouseDownCoords({x: event.clientX, y: event.clientY});
    }

    function isDrag(clickCoords: Point2d): boolean | undefined {
        const mouseDownToClickMaxDist = window.innerHeight * 0.01;

        if (!mouseDownCoords) {
            logInfo('mouseDownCoords is not defined, returning undefined');
            return undefined;
        }

        if (!clickCoords || !clickCoords.x || !clickCoords.y) {
            logInfo('invalid click coordinates, returning drag=true');
            return undefined;
        }
        const mouseDownToClickDist = calculateDistance({x: clickCoords.x, y: clickCoords.y}, {x: mouseDownCoords.x, y: mouseDownCoords.y});
        setMouseDownCoords(null);
        
        logInfo(`clientX: ${clickCoords.x}, clientY: ${clickCoords.y}, mouseDownCoords.x: ${mouseDownCoords.x}, mouseDownCoords.y: ${mouseDownCoords.y} distance: ${mouseDownToClickDist}, max distance: ${mouseDownToClickMaxDist}`); 
        if ( mouseDownToClickDist && (mouseDownToClickDist > mouseDownToClickMaxDist)) {
            logInfo('Click is a drag');
            return true;
        }
    }

    function handleModelClick(event: React.MouseEvent) {
        const { clientX, clientY } = event;

        if (isDrag({x: clientX, y: clientY})) {
            return;
        }

        if (modelRef.current) {
            let hit = modelRef.current.positionAndNormalFromPoint(clientX, clientY);
            if (hit) {
                if (annotationsData.some((annotation: Annotation) => annotation.id === UNSAVED_ANNOTATION_ID)) {
                    removeUnsavedAnnotation();
                    return;
                }
                addNewAnnotation(hit);
            } else {
                handleBackgroundClick();
            }
        }
    };

    const style = {
        height: '94vh',
        width: '100vw',
        background: 'white',
        backgroundImage: 'radial-gradient(grey 1px, transparent 0)',
        backgroundSize: '40px 40px',
        backgroundPosition: '-19px -19px'
    };

    const annotationComponents = annotationsData ? 
        annotationsData.map((annotation: Annotation, index: number) =>
            annotation && annotation.id ? 
                <AnnotationContainer 
                    key = {`${annotation.id}-annotation-label`}
                    annotation = {annotation}
                    handleDelete = {deleteAnnotation}
                    handleRename = {persistAnnotation}
                />
                : null)
        : [];

    return (
        <div className="model">
            <model-viewer 
                src={MODEL_FILE_URL} 
                ar-modes="webxr scene-viewer quick-look" 
                camera-controls poster="poster.webp" 
                shadow-intensity="1"
                onClick={handleModelClick}
                onMouseDown={handleMouseDown}
                ref={(ref: JSX.IntrinsicElements["model-viewer"]) => {
                    modelRef.current = ref;
                }}
                style={style}
                disable-zoom
                disable-pan
                >
                <div className="progress-bar hide" slot="progress-bar">
                    <div className="update-bar"></div>
                </div>
                {annotationComponents}
            </model-viewer>
        </div>
    );
}
