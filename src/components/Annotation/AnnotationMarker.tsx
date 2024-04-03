import React from 'react';
import { Annotation } from '../../types/Annotation';
import { point3dToString } from '../../utils/pointUtils';

interface AnnotationMarkerProps {
    annotation: Annotation;
}

export function AnnotationMarker(props: AnnotationMarkerProps) {
    const annotationMarkerStyle = {
        background: '#D9594C',
        backgroundColor: '#04AA6D',
        border: 'none',
        color: 'white',
        padding: '10px',
        textDecoration: 'none',
        margin: '4px 2px',
        borderRadius: '50%'
    };

    return (
        <button
            id={props.annotation.id}
            className="view-button"
            slot={`hotspot-${props.annotation.id}`}
            data-position={point3dToString(props.annotation.position)}
            data-normal={point3dToString(props.annotation.normal)}
            style={annotationMarkerStyle}
        />
    );
}