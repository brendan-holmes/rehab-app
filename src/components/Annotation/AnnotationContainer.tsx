import React from 'react';
import { Annotation } from '../../types/Annotation';
import { AnnotationMarker } from './AnnotationMarker';
import { AnnotationLabel } from './AnnotationLabel';

interface AnnotationProps {
    annotation: Annotation;

    // move to annotation label
    handleClick: (id: string) => void;
    handleAnnotationClick: (e: React.MouseEvent, id: string) => void;
    handleDeleteClick: (event: React.MouseEvent, id: string) => void;
    handleRename: (annotation: Annotation) => void;
    isInEdit: boolean; // move to state of annotation label
}

export function AnnotationContainer(props: AnnotationProps) {

    return  (
        <>
            <AnnotationMarker annotation={props.annotation} handleAnnotationClick={props.handleAnnotationClick} />
            <AnnotationLabel annotation={props.annotation} handleClick={props.handleClick} handleDeleteClick={props.handleDeleteClick} handleRename={props.handleRename} isInEdit={props.isInEdit} />
        </>
    )
}
