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
                <p>{props.timeStamp}</p>
                <p><strong>Field 1</strong> {props.A}</p>
                <p><strong>Field 2</strong> {props.B}</p>
            </li> 
        </div>
    )
}

export default InfoCard;