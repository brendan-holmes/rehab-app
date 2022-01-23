import React, { useState } from 'react';
import {put} from '../apiClient.js';

const Form = (props) => {
  
  const [inputs, setInputs] = useState({'ID': '', 'A': '', 'B': ''});
  
  const handleChange = (event) => {
    const key = event.target.id;
    if (key in inputs) {
      setInputs({...inputs, [key]: event.target.value});
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setInputs({'ID': '', 'A': '', 'B': ''});
    const data = {
      'Item': {
          'id': inputs.ID,
          'A': inputs.A,
          'B': inputs.B
      }
    };
    put(data)
      .then(result => {
        console.log('Success: ', result);
      })
      .catch(error => alert('Error saving fields', error));
      props.setIsListRefreshRequired(true);
  };
  
  return (
    <form>
      <div><label>ID <input type='number' id='ID' value={inputs.ID} onChange={handleChange}/></label></div>
      <div><label>A <input type='number' id='A' value={inputs.A} onChange={handleChange}/></label></div>
      <div><label>B <input type='number' id='B' value={inputs.B} onChange={handleChange}/></label></div>
      <div><button type='submit' value='Submit' onClick={handleSubmit}>Submit</button></div>
    </form>
  );
}

export default Form;