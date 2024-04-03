import React from 'react';
import { AnnotationContainer } from './Annotation/AnnotationContainer';
import { Annotation } from '../types/Annotation';
import '@google/model-viewer/dist/model-viewer';
import { logInfo, logError } from '../logging';
import { Point2d } from '../types/Point2d';
import { toast } from 'react-toastify';
import { list, remove, put } from '../apiClient';
import { useEffect, useState, useRef } from 'react';
import { TEMPORARY_ANNOTATION_ID } from './Annotation/annotationConstants';
import { calculateDistance } from '../utils/pointUtils';

export function Model () {
    const [annotationsData, setAnnotationsData] = useState<Annotation[]>([]);
    const [tempAnnotationData, setTempAnnotationData] = useState<Annotation | null>(null);

    const modelRef1 = useRef<JSX.IntrinsicElements["model-viewer"]>();
    const [mouseDownCoords, setMouseDownCoords] = useState<Point2d | null>(null);

    const MODEL_FILE_URL = 'https://rehab-app-brendan-holmes-net.s3.ap-southeast-2.amazonaws.com/human-body-model.glb';
    
    const mouseDownToClickMaxDist = window.innerHeight * 0.01;

    useEffect(() => {
        refreshData();
    }, []);

    // Used to determine if a click is a drag or a click
    function handleMouseDown (event: React.MouseEvent) {
        logInfo(`Mouse down event: Setting mouse down coords to: ${{x: event.clientX, y: event.clientY}}`);
        setMouseDownCoords({x: event.clientX, y: event.clientY});
    }

    function refreshData() {
        list()
            .then((annotations: Annotation[]) => {
                logInfo(`Got data from api.list(): ${annotations}`, );
                setAnnotationsData(annotations);
                toast("Data refreshed");
            })
            .catch((error: Error) => toast(`Unable to refresh data: ${error}`));
        };

    function handleBackgroundClick() {
        setTempAnnotationData(null);
    }

    // Every annotation is first added as a temporary annotation,
    // and then gets persisted once it has been saved
    function addTemporaryAnnotation(dataPoint: Annotation) {
        logInfo(`Setting temp annotation: ${dataPoint}`);
        dataPoint.id = TEMPORARY_ANNOTATION_ID; // todo: redesign
        dataPoint.timestamp = new Date().toUTCString();
        setTempAnnotationData(dataPoint);
    }
    
    function persistAnnotation(annotationWithId: Annotation) {
        if (!annotationWithId.id) {
            logError('Attempting to persist an annotation that doesn\'t have a id.');
            return;
        }
        if (!annotationWithId.name) {
            annotationWithId.name = "Unnamed injury";
        }
        let newData;
        logInfo('Created ID: ', annotationWithId.id);

        put(annotationWithId, annotationWithId.id)
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
        refreshData();
        setTempAnnotationData(null);
        return newData;
    };

    function deleteAnnotation (event: React.MouseEvent, id: string) {
        if (event) {
            event.stopPropagation();

            logInfo(`[DeleteAnnotation] Delete clicked on annotation with id: ${id}`);
            if (id) {
                if (id === TEMPORARY_ANNOTATION_ID) {
                    logInfo('[DeleteAnnotation] Removing temp annotation...');
                    setTempAnnotationData(null);
                    return;
                }
        
                logInfo(`[DeleteAnnotation] deleting annotation with id: ${id}`);
                const name = annotationsData.filter((a: Annotation) => a.id === id)[0].name || 'injury';
                if (!window.confirm(`Delete ${name}?`)) {
                    logInfo(`[DeleteAnnotation] Deletion cancelled by user with id: ${id}`);
                    return;
                }
                let newData;
                setAnnotationsData((existingAnnotations: Annotation[]) => {
                    logInfo(`[DeleteAnnotation] Existing annotations: ${existingAnnotations}`);
                    newData = existingAnnotations.filter(annotation => annotation.id !== id);
                    logInfo(`[DeleteAnnotation] Removed annotation with id: ${id}`);
                    logInfo(`[DeleteAnnotation] New annotations: ${newData}`);
                    return newData;
                });
                remove(id)
                    .then((response: Response | null) => response?.json())
                    .then(() => toast("Deleted injury"))
                    .catch((error: Error) => {
                        logInfo(`[DeleteAnnotation] An error occurred: ${error}`);
                        toast(`Unable to delete`)
                    });
                return newData;
            }
        }
    }

    function handleModelClick(event: React.MouseEvent) {
        const { clientX, clientY } = event;

        // todo: this is a hack to prevent the click event from firing when dragging
        if (mouseDownCoords === null) {
            logInfo('mouseDownCoords is null, returning');
            return;
        }
        const mouseDownToClickDist = calculateDistance({x: clientX, y: clientY}, {x: mouseDownCoords.x, y: mouseDownCoords.y});
        setMouseDownCoords(null);
        logInfo(`distance: ${mouseDownToClickDist}`);
        logInfo(`max distance: ${mouseDownToClickMaxDist}`);
        if ( mouseDownToClickDist !== null && (mouseDownToClickDist > mouseDownToClickMaxDist)) {
            logInfo(`clientX: ${clientX}, clientY: ${clientY}, mouseDownCoords.x: ${mouseDownCoords?.x}, mouseDownCoords.y: ${mouseDownCoords?.y} distance: ${mouseDownToClickDist}`); 
            logInfo('Click start and end point too far away.');
            return;
        }

        if (modelRef1.current) {
            let hit = modelRef1.current.positionAndNormalFromPoint(clientX, clientY);
            if (hit) {
                if (tempAnnotationData) {
                    setTempAnnotationData(null);
                    return;
                }
                addTemporaryAnnotation(hit);
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
                    handleDeleteClick = {deleteAnnotation}
                    handleRename = {persistAnnotation}
                />
                : null)
        : [];
    
    if (annotationComponents && tempAnnotationData && tempAnnotationData.id) {
        annotationComponents.push(
            <AnnotationContainer 
                key = {`${tempAnnotationData.id}-annotation-label`}
                annotation = {tempAnnotationData}
                handleDeleteClick = {deleteAnnotation}
                handleRename = {persistAnnotation}
            />);
    } 

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
                    modelRef1.current = ref;
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
