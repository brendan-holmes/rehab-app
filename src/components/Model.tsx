import '@google/model-viewer/dist/model-viewer';
import React from 'react';

import { logInfo, logError } from '../logging';
import Annotation from './Annotation';
import IAnnotation from '../interfaces/IAnnotation';
import AnnotationLabel from './AnnotationLabel';
import IPoint2d from '../interfaces/IPoint2d';

const { useState, useRef } = require('react');

interface IModelProps {
    annotations: IAnnotation[];
    tempAnnotation: IAnnotation;
    labelInEdit: string;
    handleModelClick: (annotation: IAnnotation) => void;
    handleBackgroundClick: () => void;
    handleLabelClick: (id: string) => void;
    handleRename: (annotation: IAnnotation) => void;
    deleteDataById: (id: string) => void;
}

export default function Model(props: IModelProps) {
    const modelURL = 'https://rehab-app-brendan-holmes-net.s3.ap-southeast-2.amazonaws.com/human-body-model.glb';
    const modelRef1 = useRef();
    const [mouseDownCoords, setMouseDownCords] = useState(null);

    const getLabelDistanceToAnnotation = (numberOfCharacters: number) => {
        const multiplier = 0.25;
        return (13 + numberOfCharacters) * multiplier;
    }

    const mouseDownToClickMaxDist = window.innerHeight * 0.01;

    const handleMouseDown = (event: any) => {
        logInfo('Mouse down event: Setting mouse down coords to: ', {x: event.clientX, y: event.clientY}.toString());
        setMouseDownCords({x: event.clientX, y: event.clientY});
    }

    const calculateDistance = (point1: IPoint2d, point2: IPoint2d) => {
        if (!point1.x || !point1.y || !point2.x || !point2.y) {
            logError('Cannot calculate distance, one or more points are invalid. point1: ', point1.toString(), ', point2: ', point2.toString());
        }

        return Math.sqrt(Math.pow(point2.x - point1.x, 2) + Math.pow(point2.y - point1.y, 2));
    }

    // todo: find specific event type
    const handleModelClick = (event: any) => {
        const { clientX, clientY } = event;

        const mouseDownToClickDist = calculateDistance({x: clientX, y: clientY}, {x: mouseDownCoords.x, y: mouseDownCoords.y});
        setMouseDownCords(null);
        logInfo('distance: ', mouseDownToClickDist.toString());
        logInfo('max distance: ', mouseDownToClickMaxDist.toString());
        if ( mouseDownToClickDist > mouseDownToClickMaxDist) {
            logInfo('clientX: ', clientX, ', clientY: ', ', mouseDownCoords.x: ', mouseDownCoords.x.toString(), ' , mouseDownCoords.y: ', mouseDownCoords.y.toString(), ' , distance: ', mouseDownToClickDist.toString());
            logInfo('Click start and end point too far away.')
            return;
        }

        if (modelRef1.current) {
            let hit = modelRef1.current.positionAndNormalFromPoint(clientX, clientY);
            if (hit) {
                props.handleModelClick(hit);
            } else {
                props.handleBackgroundClick();
            }
        }
    };

    const handleDeleteClick = (event: any, id: string) => {
        if (event) {
            event.stopPropagation();

            logInfo("Delete clicked. id: ", id);
            if (id) {
                props.deleteDataById(id);
            }
        }
    }

    const getDataPositionString = (annotation: IAnnotation) => {
        if (!annotation || !annotation.position) {
            logInfo('Annotation position is not defined in getDataPosition');
            return '';
        }
            
        return `${annotation.position.x} ${annotation.position.y} ${annotation.position.z}`;
    };

    const getDataPositionStringWithOffset = (annotation: IAnnotation, offset = {x: 0, y: 0, z: 0}): string => {
        if (!annotation || !annotation.position) {
            logInfo('Annotation position is not defined in getDataPositionWithOffset');
            return '';
        }

        return `${annotation.position.x + offset.x} ${annotation.position.y + offset.y} ${annotation.position.z + offset.z}`;
      };
    
    const getDataNormalString = (annotation: IAnnotation): string => {
        if (!annotation || !annotation.normal) {
            logInfo('Annotation normal is not defined. Returning empty string in getDataNormalString');
            return '';
        }

        return `${annotation.normal.x} ${annotation.normal.y} ${annotation.normal.z}`;
    };

    const style = {
        height: '94vh',
        width: '100vw',
        background: 'white',
        backgroundImage: 'radial-gradient(grey 1px, transparent 0)',
        backgroundSize: '40px 40px',
        backgroundPosition: '-19px -19px'
    };

    const annotations = props.annotations ? 
        props.annotations.map((annotation, idx) => {
            if (annotation && annotation.id) {
                return (
                    <Annotation 
                        key = {`${annotation.id}-annotation`}
                        annotation = {annotation}
                        dataPosition = {getDataPositionString(annotation)}
                        dataNormal = {getDataNormalString(annotation)}
                        handleAnnotationClick = {handleDeleteClick}
                    />
                )
            } else {
                return null;
            }
        })
        : null;

    const annotationLabels = props.annotations ? 
        props.annotations.map((annotation, idx) => {
            if (annotation && annotation.id) {
                return (
                    <AnnotationLabel 
                        key = {`${annotation.id}-annotation-label`}
                        annotation = {annotation}
                        dataPositionString = {getDataPositionStringWithOffset(annotation, {x:getLabelDistanceToAnnotation(annotation?.name?.length || 0), y: 1, z: 0})}
                        dataNormalString = {getDataNormalString(annotation)}
                        handleDeleteClick = {handleDeleteClick}
                        handleRename = {props.handleRename}
                        handleClick = {props.handleLabelClick}
                        isInEdit = {props.labelInEdit === annotation.id}
                    />
                )
            } else {
                return null;
            }
        })
        : null;
    
    const tempAnnotation = props.tempAnnotation && props.tempAnnotation.id ? 
        <Annotation 
            key = {`${props.tempAnnotation.id}-annotation`}
            annotation = {props.tempAnnotation}
            dataPosition = {getDataPositionString(props.tempAnnotation)}
            dataNormal = {getDataNormalString(props.tempAnnotation)}
            handleAnnotationClick = {handleDeleteClick}
        /> :
        null;
    
    const tempAnnotationLabel = props.tempAnnotation && props.tempAnnotation.id ? 
        <AnnotationLabel 
            key = {`${props.tempAnnotation.id}-annotation-label`}
            annotation = {props.tempAnnotation}
            dataPositionString = {getDataPositionStringWithOffset(props.tempAnnotation, {x:getLabelDistanceToAnnotation(props?.tempAnnotation?.name?.length || 0), y: 1, z: 0})}
            dataNormalString = {getDataNormalString(props.tempAnnotation)}
            handleDeleteClick = {handleDeleteClick}
            handleRename = {props.handleRename}
            handleClick = {props.handleLabelClick}
            isInEdit = {props.labelInEdit === props.tempAnnotation.id}
        /> :
        null;
        

    return (
        <div className="model">
            <model-viewer 
                src={modelURL} 
                ar-modes="webxr scene-viewer quick-look" 
                camera-controls poster="poster.webp" 
                shadow-intensity="1"
                onClick={handleModelClick}
                onMouseDown={handleMouseDown}
                // onMouseUp={handleMouseUp}
                ref={(ref: any) => {
                    modelRef1.current = ref;
                }}
                style={style}
                disable-zoom
                disable-pan
                >
                <div className="progress-bar hide" slot="progress-bar">
                    <div className="update-bar"></div>
                </div>
                {annotations}
                {annotationLabels}
                {tempAnnotation}
                {tempAnnotationLabel}
            </model-viewer>
        </div>
    )
}