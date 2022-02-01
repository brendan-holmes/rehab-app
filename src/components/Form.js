import React, { useState } from 'react';
import {put} from '../apiClient.js';

const getNewKey = () => {
  var ts = new Date().getTime();
  const randid = Math.floor(Math.random() * 512);
  return ((ts * 512) + randid).toString();
}

const Form = (props) => {
  
  const [inputs, setInputs] = useState({'A': '', 'B': ''});
  const [showForm, setShowForm] = useState(false);
  
  const handleChange = (event) => {
    const key = event.target.id;
    if (key in inputs) {
      setInputs({...inputs, [key]: event.target.value});
    }
  };

  const handleAdd = () => setShowForm(true);
  const handleCancel = () => setShowForm(false);

  const handleSubmit = (event) => {
    event.preventDefault();
    setInputs({'A': '', 'B': ''});
    const data = {
      'A': inputs.A, 
      'B': inputs.B,
      'id': getNewKey(),
      'timeStamp': new Date().toUTCString()};
    props.addItem(data);
    setShowForm(false);

    put(data)
      .then(response => response.json())
      .then(() => props.addToast({"message": `Added item`, "type": "success"}))
      .catch(error => props.addToast({"title": "Error", "message": `An error occurred: ${error.message}`, "type": "error"}));
  };
  
  if (showForm) {
    return (
      <form className="b-form">
        <div className="form-field">
          <label>
            Field A <input className="form-input" type='number' id='A' value={inputs.A} placeholder="Enter a number" onChange={handleChange}/>
          </label>
        </div>
        <div>
          <label>
            Field B <input className="form-input" type='number' id='B' value={inputs.B} placeholder="Enter a number" onChange={handleChange}/>
          </label>
        </div>
        <div className="form-field">
          <button className="form-button" type='submit' onClick={handleSubmit}>Save</button>
          <button className="form-button" type='button' onClick={handleCancel}>Cancel</button>
        </div>
      </form>
    );
  } else {
    return <button className="add-button" onClick={handleAdd}>Add</button>
  }
  
}

export default Form;