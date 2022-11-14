import { useState, useEffect } from 'react';
import { log } from '../logging';

export default function AnnotationLabel(props) {
    const [inputValue, setInputValue] = useState(props.annotation.name || '');

    const labelStyle = {
        backgroundColor: '#FF0000',
        background: '#D9594C',
        border: 'none',
        color: 'white',
        padding: '0.5vh 1vh',
        textDecoration: 'none'
    };

    const handleClick = (event) => {
        event.stopPropagation();
        props.handleClick(props.annotation.uuid);
    }

    const handleKeyUp = (event) => {
        if (event && event.key === 'Enter') {
            handleSaveRename(null);
        }
    }

    const inputStyle = {
        background: 'inherit',
        color: 'white',
        border: 'None',
        zIndex: 999,
        width: '8vh'
    }

    const handleSaveRename = (event) => {
        log('Saving name');
        props.annotation.name = inputValue;
        props.handleRename(props.annotation);
    }

    const handleInputChange = (event) => {
        setInputValue(event.target.value);
    }

    const capitalizeFirstLetter = (string) => {
        if (string && string.length > 0) {
            return string.charAt(0).toUpperCase() + string.slice(1);
        }
        log('Capitalize First Letter: input string is not valid: ', string);
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
                id = {`${props.annotation.uuid}-annotation-label-input`}
            />
        </span>;
    const text = props.isInEdit ? labelInput: labelText;

    const tick = props.isInEdit ? 
        <span 
            className="annotation-label-save-button" 
            onClick={(e) => {
                e.stopPropagation();
                handleSaveRename(e);
            }}
        >Save</span>
        : null;

    const cross = props.isInEdit ? null :
        <span 
            className="annotation-label-cross-button"
            onClick={(e) => {
                e.stopPropagation();
                props.handleDeleteClick(e, props.annotation.uuid);
            }}
        >×</span>;

    useEffect(() => {
        if (props.isInEdit) {
            const input = document.getElementById(`${props.annotation.uuid}-annotation-label-input`);
            if (input) {
                input.focus();
            }
        }
    }, [props.isInEdit, props.annotation])

    return (
        <button
            id = {`${props.annotation.uuid}-label`}
            className = "view-button annotation-label"
            slot = {`hotspot-${props.annotation.uuid}-label`}
            data-position = {props.dataPosition}
            data-normal = {props.dataNormal}
            style = {labelStyle}
            onClick={handleClick}
            onKeyUp={handleKeyUp}
        >
            {text}
            {tick}
            {cross}
        </button>
    )}