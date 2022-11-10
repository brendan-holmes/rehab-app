import '@google/model-viewer/dist/model-viewer';
import React, { useEffect } from 'react';

import Annotation from './Annotation';
import AnnotationLabel from './AnnotationLabel';

export default function Model(props) {
    const modelRef1 = React.useRef();

    const handleModelClick = (event) => {
        const { clientX, clientY } = event;

        if (modelRef1.current) {
            let hit = modelRef1.current.positionAndNormalFromPoint(clientX, clientY);
            if (hit) {
                props.addData(hit);
            }
        }
    };

    const handleDeleteClick = (event, id) => {
        if (event) {
            event.stopPropagation();

            console.log("Delete clicked. id: ", id);
            if (id) {
                props.deleteDataById(id);
            }
        }
    }

    const getDataPosition = (annotation, ) => {
        return `${annotation.position.x} ${annotation.position.y} ${annotation.position.z}`;
    };

    const getDataPositionWithOffset = (annotation, offset = {x: 0, y: 0, z: 0}) => {
        return `${annotation.position.x + offset.x} ${annotation.position.y + offset.y} ${annotation.position.z + offset.z}`;
      };
    
    const getDataNormal = (annotation) => {
        return `${annotation.normal.x} ${annotation.normal.y} ${annotation.normal.z}`;
    };

    const style = {
        height: '80vh',
        width: '80vw',
        // cursor: 'crosshair' // not working
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
                        dataPosition = {getDataPositionWithOffset(annotation, {x:8, y: 1, z: 0})}
                        dataNormal = {getDataNormal(annotation)}
                        handleDeleteClick = {handleDeleteClick}
                    />
                )
            } else {
                return null;
            }
        })
        : null;
    
    useEffect(() => {
        console.log('useEffect')
        console.log(props.data)
    })

    return (
        <div className="model">
            <model-viewer 
                src="./model.glb" 
                ar-modes="webxr scene-viewer quick-look" 
                camera-controls poster="poster.webp" 
                shadow-intensity="1"
                onClick={handleModelClick}
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
            </model-viewer>
        </div>
    )
}