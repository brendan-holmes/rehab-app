import React from 'react';
import { Annotation } from '../../types/Annotation';
import { point3dToString } from '../../utils/pointUtils';

interface AnnotationMarkerProps {
    annotation: Annotation;
}

export function AnnotationMarker(props: AnnotationMarkerProps) {

    return (
        <button
            id={props.annotation.id}
            className="view-button bg-green-600 border-none p-2 rounded-full"
            slot={`hotspot-${props.annotation.id}`}
            data-position={point3dToString(props.annotation.position)}
            data-normal={point3dToString(props.annotation.normal)}
        />
    );
}