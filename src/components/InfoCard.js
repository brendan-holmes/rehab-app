import React from 'react';
import {remove} from '../apiClient.js';

const InfoCard = (props) => {
    const handleDeleteClick = () => {
        console.log("Delete clicked");
        remove(props.id).then(response => console.log(response));
        props.setIsListRefreshRequired(true);
    }
    
    return (
        <div className='info-card'>
            <p className="delete-button" onClick={handleDeleteClick}>×</p>
            <li key={props.index}>
                <h3>ID {props.id}</h3>
                <p><strong>A</strong> {props.A}</p>
                <p><strong>B</strong> {props.B}</p>
            </li> 
        </div>
    )
}

export default InfoCard;