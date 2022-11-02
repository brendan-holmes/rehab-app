import '@google/model-viewer/dist/model-viewer';
import { v4 as uuidv4 } from 'uuid';
import React, { useState } from 'react';

export default function Model() {
    const modelRef1 = React.useRef();
    const [annotations, setAnnotations] = useState([]);

    const handleModelClick = (event) => {
        const { clientX, clientY } = event;

        if (modelRef1.current) {
            let hit = modelRef1.current.positionAndNormalFromPoint(clientX, clientY);
            if (hit) {
                hit.uuid = uuidv4();
                console.log('Created UUID: ', hit.uuid);
                setAnnotations((annotations) => {
                    console.log('annotations:', [...annotations, hit]);
                    return [...annotations, hit];
                });
            }
        }
    };

    const handleAnnotationClick = (event) => {
        if (event) {
            event.stopPropagation();

            // remove annotation from list
            // console.log('event.target: ', event.target);
            console.log('annotations: ', annotations);
            if (event.target && event.target.id) {
                // console.log('event.target.id: ', event.target.id);
                setAnnotations((annotations) => {
                    console.log('Removed annotation: ', event.target.id);
                    console.log('annotations:', annotations.filter(a => a.uuid !== event.target.id));
                    return annotations.filter(a => a.uuid !== event.target.id);
                });
            }
        }
    }
    const listAnnotations = () => console.log('annotations: ', annotations);

    const getDataPosition = (annotation) => {
        return `${annotation.position.x} ${annotation.position.y} ${annotation.position.z}`;
      };
    
      const getDataNormal = (annotation) => {
        return `${annotation.normal.x} ${annotation.normal.y} ${annotation.normal.z}`;
      };

    const style = {
        height: '500px',
        width: '500px'
    };

    const annotationStyle = {
        backgroundColor: '#04AA6D',
        border: 'none',
        color: 'white',
        padding: '5px',
        textDecoration: 'none',
        margin: '4px 2px',
        borderRadius: '50%'
        // textAlign: 'center',
        // display: 'inline-block',
        // font-size: '16px',
    };

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
                >
                <div className="progress-bar hide" slot="progress-bar">
                    <div className="update-bar"></div>
                </div>
                {annotations.map((annotation, idx) => (
                    <button
                        key = {annotation.uuid}
                        id = {annotation.uuid}
                        className = "view-button"
                        slot = {`hotspot-${annotation.uuid}`}
                        data-position = {getDataPosition(annotation)}
                        data-normal = {getDataNormal(annotation)}
                        style = {annotationStyle}
                        onClick = {handleAnnotationClick}
                    />
                ))}
            </model-viewer>
        </div>
    )
}