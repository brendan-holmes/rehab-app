import React, { useEffect, useState } from 'react';
import {list} from '../apiClient.js';

const Info = (props) => {
  const [data, setData] = useState(null);

  useEffect(() => {
    if (props.isListRefreshRequired) {
      list()
      .then(info => {
        console.log(info);
        setData(info);
      });
      props.setIsListRefreshRequired(false);
    }
  });

  const dynamoObjectToHtml = (data) => {
    if (data && data.Items && Array.isArray(data.Items)) {
      return (
        <ul>
          {data.Items.map((item, index) => <li key={index}>{
          JSON.stringify(item)
            .replace(/{/g,'')
            .replace(/}/g,'')
            .replace(/"/g,'')
            .replace(/,/g,', ')
          }</li> )}
        </ul>
      )
    }
  }

  const content = data === null ? 'Loading data...' : dynamoObjectToHtml(data);
  
  return <div>{content}</div>
};

export default Info;