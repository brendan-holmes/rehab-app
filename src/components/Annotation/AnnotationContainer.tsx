import React from 'react';
import { Annotation } from '../../types/Annotation';
import { AnnotationMarker } from './AnnotationMarker';
import { AnnotationLabel } from './AnnotationLabel';

interface AnnotationProps {
    annotation: Annotation;

    // todo: move to annotation label
    handleDeleteClick: (event: React.MouseEvent, id: string) => void;
    handleRename: (annotation: Annotation) => void;
}

export function AnnotationContainer(props: AnnotationProps) {

    return  (
        <>
            <AnnotationMarker annotation={props.annotation} />
            <AnnotationLabel annotation={props.annotation} handleDeleteClick={props.handleDeleteClick} handleRename={props.handleRename} />
        </>
    )
}
