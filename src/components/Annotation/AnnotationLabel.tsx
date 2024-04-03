import React, { useState, useEffect, useRef } from 'react';
import { logInfo } from '../../logging';
import { Annotation } from '../../types/Annotation';
import { addPoint3ds, point3dToString } from '../../utils/pointUtils';
import { Point3d } from '../../types/Point3d';
import { capitalizeFirstLetter } from '../../utils/stringUtils';
import { useOnClickOutside } from 'usehooks-ts';
import { TEMPORARY_ANNOTATION_ID } from './annotationConstants';

interface AnnotationLabelProps {
    annotation: Annotation;
    handleDeleteClick: (event: React.MouseEvent, id: string) => void;
    handleRename: (annotation: Annotation) => void;
}

export function AnnotationLabel(props: AnnotationLabelProps) {
    const [inputValue, setInputValue] = useState(props.annotation.name || '');

    // todo: need to make it true for new labels but false for existing labels
    const isNewAnnotation = props.annotation.id === TEMPORARY_ANNOTATION_ID;
    const [isEditing, setIsEditing] = useState(isNewAnnotation);

    // Not working currently
    useEffect(() => {
        if (isEditing) {
            const input = document.getElementById(`${props.annotation.id}-annotation-label-input`);
            if (input) {
                input.focus();
            }
        }
    }, [isEditing, props.annotation]);

    // todo fix short lag when clicking outside
    const ref = useRef(null);
    useOnClickOutside(ref, handleClickOutside);

    function handleClickOutside () {
        logInfo('Handling click outside of AnnotationLabel div element');

        setIsEditing(false);
    }

    function handleLabelClick (event: React.MouseEvent<HTMLButtonElement>) {
        event.stopPropagation();
        if (!isEditing) {
            setIsEditing(true);
        }
    }

    function handleKeyUp (event: React.KeyboardEvent) {
        if (event && event.key === 'Enter') {
            handleSaveRename();
        }
    }

    function handleSaveRename() {
        logInfo('Saving name');
        setIsEditing(false);
        props.annotation.name = inputValue;
        props.handleRename(props.annotation);
    }

    function handleInputChange(event: React.ChangeEvent<HTMLInputElement>) {
        setInputValue(event.target.value);
    }

    function getLabelOffset(): Point3d {

        // x offset is from the center of the annotation marker to the centre of the label
        // What we really want to do is to make the label left justified with the annotation marker
        const textLength = props.annotation.name?.length || 0;
        const xOffSet = 3.25 + textLength * 0.25;

        // Make the label slightly above the annotation marker
        const yOffSet = 1;

        return { x: xOffSet, y: yOffSet, z: 0 };
    }

    const labelStyle = {
        backgroundColor: '#FF0000',
        background: '#D9594C',
        border: 'none',
        color: 'white',
        padding: '0.5vh 1vh',
        textDecoration: 'none'
    };

    const inputStyle = {
        background: 'inherit',
        color: 'white',
        border: 'None',
        zIndex: 999,
        width: '8vh'
    }

    const labelText = <span className='annotation-label-text'>{capitalizeFirstLetter(props.annotation.name) || '' }</span>;
    const labelInput = 
        <span>
            <input 
                className='annotation-label-text'
                style={inputStyle} 
                placeholder='Injury name'
                onChange={handleInputChange}
                value={inputValue}
                id = {`${props.annotation.id}-annotation-label-input`}
            />
        </span>;
    const text = isEditing ? labelInput: labelText;

    const tick = isEditing ? 
        <span 
            className="annotation-label-save-button" 
            onClick={(e) => {
                e.stopPropagation();
                handleSaveRename();
            }}
        >Save</span>
        : null;

    const cross = isEditing ? null :
        <span 
            className="annotation-label-cross-button"
            onClick={(e) => {
                e.stopPropagation();
                props.handleDeleteClick(e, props.annotation.id);
            }}
        >×</span>;

    return (
        <button
            ref = {ref}
            id = {`${props.annotation.id}-label`}
            className = "view-button annotation-label"
            slot = {`hotspot-${props.annotation.id}-label`}
            data-position = {point3dToString(addPoint3ds(props.annotation.position, getLabelOffset()))}
            data-normal = {point3dToString(props.annotation.normal)}
            style = {labelStyle}
            onKeyUp={handleKeyUp}
            onClick={handleLabelClick}
        >
            {text}
            {tick}
            {cross}
        </button>
    )}
