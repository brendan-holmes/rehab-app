import React, { useState } from 'react';
import {put} from '../apiClient.js';

const getNewKey = () => {
  var ts = new Date().getTime();
  const randid = Math.floor(Math.random() * 512);
  return ((ts * 512) + randid).toString();
}

const Form = (props) => {
  
  const [inputs, setInputs] = useState({'A': '', 'B': ''});
  
  const handleChange = (event) => {
    const key = event.target.id;
    if (key in inputs) {
      setInputs({...inputs, [key]: event.target.value});
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setInputs({'A': '', 'B': ''});
    const data = {
      'A': inputs.A, 
      'B': inputs.B,
      'id': getNewKey(),
      'timeStamp': new Date().toUTCString()};
    props.addItem(data);

    put(data)
      .then(result => {
        props.addToast({"message": `Added item`, "type": "success"});
      })
      .catch(error => props.addToast({"title": "Error", "message": `An error occurred: ${error}`, "type": "error"}));
      // props.setIsListRefreshRequired(true);
  };
  
  return (
    <form className="b-form">
      <div><label>Field A <input type='number' id='A' value={inputs.A} onChange={handleChange}/></label></div>
      <div><label>Field B <input type='number' id='B' value={inputs.B} onChange={handleChange}/></label></div>
      <div><button type='submit' onClick={handleSubmit}>Add</button></div>
    </form>
  );
}

export default Form;