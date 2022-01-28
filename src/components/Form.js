import React, { useState } from 'react';
import {put} from '../apiClient.js';

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
    const data = {'A': inputs.A, 'B': inputs.B};
    put(data)
      .then(result => {
        props.addToast({"Title": "Success", "Message": `Added item`, "Type": "success"});
      })
      .catch(error => props.addToast({"title": "Error", "message": `An error occurred: ${error}`, "type": "error"}));
      props.setIsListRefreshRequired(true);
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