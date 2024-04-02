import React from 'react';
import { IAnnotation } from '../interfaces/IAnnotation';

interface IAnnotationProps {
    annotation: IAnnotation;
    dataPosition: string;
    dataNormal: string;
    handleAnnotationClick: (e: React.MouseEvent, id: string) => void;
}

export function Annotation(props: IAnnotationProps) {
    const annotationStyle = {
        background: '#D9594C',
        backgroundColor: '#04AA6D',
        border: 'none',
        color: 'white',
        padding: '10px',
        textDecoration: 'none',
        margin: '4px 2px',
        borderRadius: '50%'
    };

    return  (
        <button
            id={props.annotation.id}
            className="view-button"
            slot={`hotspot-${props.annotation.id}`}
            data-position={props.dataPosition}
            data-normal={props.dataNormal}
            style={annotationStyle}
            onClick={(e) => props.handleAnnotationClick(e, props.annotation.id)}
        />
    )
}
