import '@google/model-viewer/dist/model-viewer';
import React, { useEffect } from 'react';

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

    const handleAnnotationClick = (event) => {
        if (event) {
            event.stopPropagation();

            if (event.target && event.target.id) {
                props.deleteDataById(event.target.id);
            }
        }
    }

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
    };

    const annotations = props.data ? 
        props.data.map((annotation, idx) => {
            if (annotation && annotation.uuid) {
                return (
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
                >
                <div className="progress-bar hide" slot="progress-bar">
                    <div className="update-bar"></div>
                </div>
                {annotations}
            </model-viewer>
        </div>
    )
}