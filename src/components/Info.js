import React, { useEffect, useState } from 'react';
import {list} from '../apiClient.js';
import InfoCard from './InfoCard.js';

const Info = (props) => {
  const [data, setData] = useState(null);

  useEffect(() => {
    if (props.isListRefreshRequired) {
      list()
      .then(info => {
        // console.log(info);
        setData(info);
      });
      props.setIsListRefreshRequired(false);
    }
  });

  const dynamoObjectToHtml = (data) => {
    if (data && data.Items && Array.isArray(data.Items)) {
      return (
        <ul>
          {data.Items.map((item, index) => {
            const cardProps = {
              ...item,
              index: index,
              key: index,
              setIsListRefreshRequired: props.setIsListRefreshRequired
            };
            return <InfoCard {...cardProps}/>})}
        </ul>
      )
    }
  }

  const content = data === null ? 'Loading data...' : dynamoObjectToHtml(data);
  
  return <div>{content}</div>
};

export default Info;