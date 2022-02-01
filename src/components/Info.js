import React, { useEffect, useState } from 'react';
import {list} from '../apiClient.js';
import InfoCard from './InfoCard.js';
import Form from './Form.js';

const Info = (props) => {
  const [data, setData] = useState([]);

  const PushItem = (newItem) => {
    setData([...data, newItem])
  }

  const updateItem = (updatedItem) => {
    // Delete old version and push it onto the end
    const updatedData = [...data].filter(d => d.id !== updatedItem.id);
    updatedData.push(updatedItem);
    setData(updatedData);
  }

  useEffect(() => {
    if (props.isListRefreshRequired) {
      list()
      .then(info => {
        setData(info.Items);
        props.addToast({"message": `Data refreshed`, "type": "success"});
      })
      .catch(error => {
        props.addToast({"Message": `Unable to refresh data: ${error}`, "Type": "error"});
      });
      props.setLastUpdated(new Date());
      props.setIsListRefreshRequired(false);
    }
  });

  const content = (data) => {
    if (data && data.length > 0) {      
      if (data && Array.isArray(data)) {
        return (
          <ul className="info">
          {data.sort((a,b) => new Date(b.timeStamp) - new Date(a.timeStamp)).map((item, index) => {
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
              key: item.id,
              // setIsListRefreshRequired: props.setIsListRefreshRequired,
              addToast: props.addToast,
              setData: setData,
              data: data,
              updateItem: updateItem
            };
            return <InfoCard {...cardProps}/>})
          }
        </ul>
      )
    }
  }
  else {
    return 'No items to show';
  }
  }
  
  return (
    <div>
      <Form 
          // setIsListRefreshRequired={props.setIsListRefreshRequired}
          addToast={props.addToast}
          addItem={PushItem}
        />
      <div className="info-content">
        {content(data)}
      </div>
    </div>
  );
};

export default Info;