import React, { useEffect, useState } from 'react';
import { remove, update } from '../apiClient.js';
import { formatDate } from '../dateUtils.js';
import editIcon from './../resources/icons/pencil.png';
import deleteIcon from './../resources/icons/x.png';
import InfoCardField from './InfoCardField.js';

// pass in an object with a list of fields, each with "name" and "value" property
// e.g.
// props.timeStamp
// props.fields = [{"name":"field1", "value":"2"}, etc]
const InfoCard = (props) => {

    const [isInEdit, setIsInEdit] = useState(false);
    const [fields, setFields] = useState(props.fields);

    const handleDeleteClick = () => {
        props.setData(props.data.filter(d => d.id !== props.id));
        remove(props.id)
            .then(response => response.json())
            .then(() => props.addToast({"message": `Item deleted`, "type": "success"}))
            .catch(error => props.addToast({"message": `An error occurred: ${error.message}`, "type": "error"}));
    }

    // Update inputs whenever props.fields (data) updates
    useEffect(() => setFields(props.fields), [props.fields]);

    const handleEditClick = () => { setIsInEdit(true) }
    const handleSaveEdit = () => { 
        setIsInEdit(false);
        let fieldsObject = {};
        if (Array.isArray(fields)) {
            fields.forEach(f => {
                fieldsObject[f.name] = f.value;
            });
            const data = {
                ...fieldsObject,
                'id': props.id,
                'timeStamp': new Date().toUTCString()};
            props.updateItem(data);
                
            update(data)
                .then(response => response.json())
                .then(() => props.addToast({"message": `Item updated`, "type": "success"}))
                .catch(error => props.addToast({"title": "Error", "message": `An error occurred: ${error.message}`, "type": "error"}));
        }
    }
    const handleCancelEdit = (event) => {
        event.preventDefault();
        setIsInEdit(false);
    }

    const editButton = isInEdit ?
        null :
        (
            <li onClick={handleEditClick}>
                <img className="info-card-tool-button" src={editIcon} alt="" />
            </li>
        );
    const editOperationButtons = isInEdit ? 
        (
            <div className="form-field">
                <button className="form-button" type='submit' onClick={handleSaveEdit}>Save</button>
                <button className="form-button" type='button' onClick={handleCancelEdit}>Cancel</button>
            </div>
        ) :
        null;

    return (
        <div className='info-card'>
            <ul className="info-card-tools">
                {editButton}
                <li onClick={handleDeleteClick}>
                    <img className="info-card-tool-button" src={deleteIcon} alt="" />
                </li>
            </ul>
            <li key={props.id}>
                <p className="small-text info-card-time">{formatDate(new Date(props.timeStamp))}</p>
                {props.fields.map((field) => 
                    <InfoCardField key={field.name} isInEdit={isInEdit} name={field.name} value={field.value} inputs={fields} setInputs={setFields}/>)}
            </li> 
            {editOperationButtons}
        </div>
    )
}

export default InfoCard;