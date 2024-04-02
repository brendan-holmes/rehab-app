import React, { useState, useEffect } from 'react';
import { logInfo } from '../logging';
import { IAnnotation } from '../interfaces/IAnnotation';

interface AnnotationLabelProps {
    annotation: IAnnotation;
    handleClick: (id: string) => void;
    handleDeleteClick: (event: React.MouseEvent, id: string) => void;
    handleRename: (annotation: IAnnotation) => void;
    isInEdit: boolean;
    dataPositionString: string;
    dataNormalString: string;
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

    function capitalizeFirstLetter (string: string) {
        if (string && string.length > 0) {
            return string.charAt(0).toUpperCase() + string.slice(1);
        }
        logInfo('Capitalize First Letter: input string is not valid: ', string);
        return string;
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
            data-position = {props.dataPositionString}
            data-normal = {props.dataNormalString}
            style = {labelStyle}
            onClick={handleClick}
            onKeyUp={handleKeyUp}
        >
            {text}
            {tick}
            {cross}
        </button>
    )}
