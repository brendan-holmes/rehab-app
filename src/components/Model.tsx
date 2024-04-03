import React from 'react';
import { AnnotationContainer } from './Annotation/AnnotationContainer';
import { Annotation } from '../types/Annotation';
import '@google/model-viewer/dist/model-viewer';
import { logInfo, logError } from '../logging';
import { Point2d } from '../types/Point2d';
import { toast } from 'react-toastify';
import { list, remove, put } from '../apiClient';
import { useEffect, useState, useRef } from 'react';

export function Model () {
    const [annotationsData, setAnnotationsData] = useState<Annotation[]>([]);
    const [tempAnnotationData, setTempAnnotationData] = useState<Annotation | null>(null);

    const [labelInEdit, setLabelInEdit] = useState<string>('');
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
        setLabelInEdit('');
    }

    function handleLabelClick(id: string) {
        setLabelInEdit(id);
    }

    // Every annotation is first added as a temporary annotation,
    // and then gets persisted once it has been named
    function addTempAnnotation(dataPoint: Annotation) {
        logInfo(`Setting temp annotation: ${dataPoint}`);
        dataPoint.id = 'temporary-id'; // todo: redesign
        dataPoint.timestamp = new Date().toUTCString();
        setTempAnnotationData(dataPoint);
        setLabelInEdit(dataPoint.id);
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
        setLabelInEdit('');
        refreshData();
        setTempAnnotationData(null);
        return newData;
    };

    function deleteAnnotation (event: React.MouseEvent, id: string) {
        if (event) {
            event.stopPropagation();

            logInfo(`[DeleteAnnotation] Delete clicked on annotation with id: ${id}`);
            if (id) {
                if (isTempAnnotation(id)) {
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
                    .then(() => toast("[DeleteAnnotation] Deleted injury"))
                    .catch((error: Error) => toast(`[DeleteAnnotation] An error occurred: ${error}`));
                return newData;
            }
        }
    }

    function isTempAnnotation(id: string) {
        return tempAnnotationData && tempAnnotationData.id && id && (id === tempAnnotationData.id);
    }

    function handleModelClick(event: React.MouseEvent) {
        const { clientX, clientY } = event;

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
                if (labelInEdit) {
                    setLabelInEdit('');
                    setTempAnnotationData(null);
                    return;
                }
                addTempAnnotation(hit);
            } else {
                handleBackgroundClick();
            }
        }
    };


    // function getDataPositionString (annotation: Annotation) {
    //     if (!annotation || !annotation.position) {
    //         logInfo('Annotation position is not defined in getDataPosition');
    //         return '';
    //     }
            
    //     return `${annotation.position.x} ${annotation.position.y} ${annotation.position.z}`;
    // };

    function getDataPositionStringWithOffset(annotation: Annotation, offset = {x: 0, y: 0, z: 0}): string {
        if (!annotation || !annotation.position) {
            logError('Annotation position is not defined in getDataPositionWithOffset');
            return '';
        }

        return `${
            annotation.position.x !== null ? annotation.position.x + offset.x : 0
          } ${
            annotation.position.y !== null ? annotation.position.y + offset.y : 0
          } ${
            annotation.position.z !== null ? annotation.position.z + offset.z : 0
          }`;
      };
    
    

    function calculateDistance (point1: Point2d, point2: Point2d): number | null {
        if (!point1.x || !point1.y || !point2.x || !point2.y) {
            logError(`Cannot calculate distance, one or more points are invalid. point1: ${point1}, point2: ${point2}`);
            return null;
        }

        return Math.sqrt(Math.pow(point2.x - point1.x, 2) + Math.pow(point2.y - point1.y, 2));
    }

    const style = {
        height: '94vh',
        width: '100vw',
        background: 'white',
        backgroundImage: 'radial-gradient(grey 1px, transparent 0)',
        backgroundSize: '40px 40px',
        backgroundPosition: '-19px -19px'
    };

    const annotationComponents = annotationsData ? 
        annotationsData.map((annotation: Annotation, index: number) => {
            if (annotation && annotation.id) {
                return (
                    <AnnotationContainer 
                        key = {`${annotation.id}-annotation-label`}
                        annotation = {annotation}
                        handleDeleteClick = {deleteAnnotation}
                        handleRename = {persistAnnotation}
                        handleClick = {handleLabelClick}
                        isInEdit = {labelInEdit === annotation.id}
                        handleAnnotationClick={deleteAnnotation}
                    />
                );
            }
        })
        : [];
    
    if (annotationComponents && tempAnnotationData && tempAnnotationData.id) {
        annotationComponents.push(
            <AnnotationContainer 
            key = {`${tempAnnotationData.id}-annotation-label`}
            annotation = {tempAnnotationData}
            handleDeleteClick = {deleteAnnotation}
            handleRename = {persistAnnotation}
            handleClick = {handleLabelClick}
            handleAnnotationClick={deleteAnnotation}
            isInEdit = {labelInEdit === tempAnnotationData.id}
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
