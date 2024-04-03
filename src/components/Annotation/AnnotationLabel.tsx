import React, { useState, useEffect } from 'react';
import { logInfo } from '../../logging';
import { Annotation } from '../../types/Annotation';
import { addPoint3ds, point3dToString } from '../../utils/pointUtils';
import { Point3d } from '../../types/Point3d';

interface AnnotationLabelProps {
    annotation: Annotation;
    handleClick: (id: string) => void;
    handleDeleteClick: (event: React.MouseEvent, id: string) => void;
    handleRename: (annotation: Annotation) => void;
    isInEdit: boolean;
}

export function AnnotationLabel(props: AnnotationLabelProps) {
    const [inputValue, setInputValue] = useState(props.annotation.name || '');

    useEffect(() => {
        if (props.isInEdit) {
            const input = document.getElementById(`${props.annotation.id}-annotation-label-input`);
            if (input) {
                input.focus();
            }
        }
    }, [props.isInEdit, props.annotation])

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

    function handleClick (event: React.MouseEvent) {
        event.stopPropagation();
        props.handleClick(props.annotation.id);
    }

    function handleKeyUp (event: React.KeyboardEvent) {
        if (event && event.key === 'Enter') {
            handleSaveRename();
        }
    }

    function handleSaveRename() {
        logInfo('Saving name');
        props.annotation.name = inputValue;
        props.handleRename(props.annotation);
    }

    function handleInputChange(event: React.ChangeEvent<HTMLInputElement>) {
        setInputValue(event.target.value);
    }

    // todo: move to utils
    function capitalizeFirstLetter (string: string) {
    if (string && string.length > 0) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }
    logInfo('Capitalize First Letter: input string is not valid: ', string);
    return string;
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
    const text = props.isInEdit ? labelInput: labelText;

    const tick = props.isInEdit ? 
        <span 
            className="annotation-label-save-button" 
            onClick={(e) => {
                e.stopPropagation();
                handleSaveRename();
            }}
        >Save</span>
        : null;

    const cross = props.isInEdit ? null :
        <span 
            className="annotation-label-cross-button"
            onClick={(e) => {
                e.stopPropagation();
                props.handleDeleteClick(e, props.annotation.id);
            }}
        >×</span>;

    return (
        <button
            id = {`${props.annotation.id}-label`}
            className = "view-button annotation-label"
            slot = {`hotspot-${props.annotation.id}-label`}
            data-position = {point3dToString(addPoint3ds(props.annotation.position, getLabelOffset()))}
            data-normal = {point3dToString(props.annotation.normal)}
            style = {labelStyle}
            onClick={handleClick}
            onKeyUp={handleKeyUp}
        >
            {text}
            {tick}
            {cross}
        </button>
    )}
