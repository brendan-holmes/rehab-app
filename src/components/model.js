import '@google/model-viewer/dist/model-viewer';
import React, { useState } from 'react';
import { log, error } from '../logging';
import Annotation from './Annotation';
import AnnotationLabel from './AnnotationLabel';

export default function Model(props) {
    const modelURL = 'https://rehab-app-brendan-holmes-net.s3.ap-southeast-2.amazonaws.com/human-body-model.glb';
    const modelRef1 = React.useRef();
    const [mouseDownCoords, setMouseDownCords] = useState(null);

    const getLabelDistanceToAnnotation = (numberOfCharacters) => {
        const multiplier = 0.18;
        return (18 + numberOfCharacters) * multiplier;
    }

    const mouseDownToClickMaxDist = window.innerHeight * 0.01;

    const handleMouseDown = (event) => {
        log('Mouse down event: Setting mouse down coords to: ', {x: event.clientX, y: event.clientY});
        setMouseDownCords({x: event.clientX, y: event.clientY});
    }

    const calculateDistance = (point1, point2) => {
        if (point1.x && point1.y && point2.x && point2.y) {
            return Math.sqrt(Math.pow(point2.x - point1.x, 2) + Math.pow(point2.y - point1.y, 2));
        }

        error('Cannot calculate distance, something is not defined ');
    }

    const handleModelClick = (event) => {
        const { clientX, clientY } = event;

        const mouseDownToClickDist = calculateDistance({x: clientX, y: clientY}, {x: mouseDownCoords.x, y: mouseDownCoords.y});
        setMouseDownCords(null);
        log('distance: ', mouseDownToClickDist);
        log('max distance: ', mouseDownToClickMaxDist);
        if ( mouseDownToClickDist > mouseDownToClickMaxDist) {
            log('clientX: ', clientX, ', clientY: ', ', mouseDownCoords.x: ', mouseDownCoords.x, ' , mouseDownCoords.y: ', mouseDownCoords.y, ' , distance: ', mouseDownToClickDist);
            log('Click start and end point too far away.')
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

    const handleDeleteClick = (event, id) => {
        if (event) {
            event.stopPropagation();

            log("Delete clicked. id: ", id);
            if (id) {
                props.deleteDataById(id);
            }
        }
    }

    const getDataPosition = (annotation) => {
        return `${annotation.position.x} ${annotation.position.y} ${annotation.position.z}`;
    };

    const getDataPositionWithOffset = (annotation, offset = {x: 0, y: 0, z: 0}) => {
        return `${annotation.position.x + offset.x} ${annotation.position.y + offset.y} ${annotation.position.z + offset.z}`;
      };
    
    const getDataNormal = (annotation) => {
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

    const annotations = props.data ? 
        props.data.map((annotation, idx) => {
            if (annotation && annotation.uuid) {
                return (
                    <Annotation 
                        key = {`${annotation.uuid}-annotation`}
                        annotation = {annotation}
                        dataPosition = {getDataPosition(annotation)}
                        dataNormal = {getDataNormal(annotation)}
                        handleAnnotationClick = {handleDeleteClick}
                    />
                )
            } else {
                return null;
            }
        })
        : null;

    

    const annotationLabels = props.data ? 
        props.data.map((annotation, idx) => {
            if (annotation && annotation.uuid) {
                return (
                    <AnnotationLabel 
                        key = {`${annotation.uuid}-annotation-label`}
                        annotation = {annotation}
                        dataPosition = {getDataPositionWithOffset(annotation, {x:getLabelDistanceToAnnotation(annotation?.name?.length || 0), y: 1, z: 0})}
                        dataNormal = {getDataNormal(annotation)}
                        handleDeleteClick = {handleDeleteClick}
                        handleRename = {props.handleRename}
                        handleClick = {props.handleLabelClick}
                        isInEdit = {props.labelInEdit === annotation.uuid}
                    />
                )
            } else {
                return null;
            }
        })
        : null;
    
    const tempAnnotation = props.tempAnnotation && props.tempAnnotation.uuid ? 
        <Annotation 
            key = {`${props.tempAnnotation.uuid}-annotation`}
            annotation = {props.tempAnnotation}
            dataPosition = {getDataPosition(props.tempAnnotation)}
            dataNormal = {getDataNormal(props.tempAnnotation)}
            handleAnnotationClick = {handleDeleteClick}
        /> :
        null;
    
    const tempAnnotationLabel = props.tempAnnotation && props.tempAnnotation.uuid ? 
        <AnnotationLabel 
            key = {`${props.tempAnnotation.uuid}-annotation-label`}
            annotation = {props.tempAnnotation}
            dataPosition = {getDataPositionWithOffset(props.tempAnnotation, {x:getLabelDistanceToAnnotation(props?.tempAnnotation?.name?.length || 0), y: 1, z: 0})}
            dataNormal = {getDataNormal(props.tempAnnotation)}
            handleDeleteClick = {handleDeleteClick}
            handleRename = {props.handleRename}
            handleClick = {props.handleLabelClick}
            isInEdit = {props.labelInEdit === props.tempAnnotation.uuid}
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
                ref={(ref) => {
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