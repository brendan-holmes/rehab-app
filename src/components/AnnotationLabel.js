import deleteIcon from './../resources/icons/x.png';
import tickIcon from './../resources/icons/tick.png';
import { useState, useEffect } from 'react';
import { log } from '../logging';

export default function AnnotationLabel(props) {
    const [inputValue, setInputValue] = useState(props.annotation.name || '');

    const labelStyle = {
        backgroundColor: '#FF0000',
        background: 'linear-gradient(130deg, #CC00CC 33%, #CCCC11 85%, #00FFCC 100%)',
        border: 'none',
        color: 'white',
        padding: '10px',
        textDecoration: 'none',
        margin: '4px 2px'
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
        return string.charAt(0).toUpperCase() + string.slice(1);
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
        <img 
            className="annotation-label-button" 
            src={tickIcon} 
            alt="" 
            onClick={(e) => {
                e.stopPropagation();
                handleSaveRename(e);
            }}
        />
    : null;

    const cross = 
        <img 
            className="annotation-label-button" 
            src={deleteIcon} 
            alt="" 
            onClick={(e) => {
                e.stopPropagation();
                props.handleDeleteClick(e, props.annotation.uuid);
            }}
        />

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