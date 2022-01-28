import React, { useEffect, useState } from 'react';
import {list} from '../apiClient.js';
import InfoCard from './InfoCard.js';
import { formatDate } from '../dateUtils.js';

const Info = (props) => {
  const [data, setData] = useState(null);

  useEffect(() => {
    if (props.isListRefreshRequired) {
      list()
      .then(info => {
        // console.log(info);
        setData(info);
        props.addToast({"title": "Success", "message": `Refreshed data`, "type": "success"});
      })
      .catch(error => {
        props.addToast({"Title": "Error", "Message": `Unable to refresh data: ${error}`, "Type": "error"});
      });
      props.setLastUpdated(formatDate(new Date()));
      props.setIsListRefreshRequired(false);
    }
  });

  const dynamoObjectToHtml = (data) => {
    if (data && data.Items && Array.isArray(data.Items)) {
      return (
        <ul>
          {data.Items.map((item, index) => {
            const cardProps = {
              fields: [
                {
                  "name": "A",
                  "value": item.A
                },
                {
                  "name": "B",
                  "value": item.B
                },
              ],
              id: item.id,
              timeStamp: item.timeStamp,
              index: index,
              key: index,
              setIsListRefreshRequired: props.setIsListRefreshRequired,
              addToast: props.addToast
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