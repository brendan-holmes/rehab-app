import React from 'react';
import {remove} from '../apiClient.js';
import { formatDate } from '../dateUtils.js';

// pass in an object with a list of fields, each with "name" and "value" property
// e.g.
// props.timeStamp
// props.fields = [{"name":"field1", "value":"2"}, etc]
const InfoCard = (props) => {
    const handleDeleteClick = () => {
        // console.log(`Delete clicked (id: ${props.id})`);
        props.setData(props.data.filter(d => d.id !== props.id));
        remove(props.id)
            .then(response => props.addToast({"title": "Success", "message": `Deleted item`, "type": "success"}))
            .catch(error => props.addToast({"title": "Success", "message": `Deleted item`, "type": "success"}));
        // props.setIsListRefreshRequired(true);
    }
    
    return (
        <div className='info-card'>
            <p className="delete-button" onClick={handleDeleteClick}>×</p>
            <li key={props.index}>
                <p className="small-text">{formatDate(new Date(props.timeStamp))}</p>
                {props.fields.map((field, index) => <p key={index}><strong>{field.name}</strong> {field.value}</p>)}
            </li> 
        </div>
    )
}

export default InfoCard;