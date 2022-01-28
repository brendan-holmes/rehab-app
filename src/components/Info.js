import React, { useEffect, useState } from 'react';
import {list} from '../apiClient.js';
import InfoCard from './InfoCard.js';
import Form from './Form.js';

const Info = (props) => {
  const [data, setData] = useState([]);

  const PushItem = (newItem) => {
    setData([...data, newItem])
  }

  useEffect(() => {
    if (props.isListRefreshRequired) {
      list()
      .then(info => {
        // console.log(info);
        setData(info.Items);
        props.addToast({"message": `Refreshed data`, "type": "success"});
      })
      .catch(error => {
        props.addToast({"Message": `Unable to refresh data: ${error}`, "Type": "error"});
      });
      props.setLastUpdated(new Date());
      props.setIsListRefreshRequired(false);
    }
  });

  const content = (data) => {
    if (data !== null) {      
      if (data && Array.isArray(data)) {
        return (
          <ul>
          {data.sort((a,b) => new Date(b.timeStamp) - new Date(a.timeStamp)).map((item, index) => {
            const cardProps = {
              fields: [
                {
                  "name": "Field A",
                  "value": item.A
                },
                {
                  "name": "Field B",
                  "value": item.B
                },
              ],
              id: item.id,
              timeStamp: item.timeStamp,
              index: index,
              key: index,
              // setIsListRefreshRequired: props.setIsListRefreshRequired,
              addToast: props.addToast,
              setData: setData,
              data: data
            };
            return <InfoCard {...cardProps}/>})
            }
        </ul>
      )
    }
  }
  else {
    return 'Loading data...';
  }
  }
  
  return (
    <div>
      <Form 
          // setIsListRefreshRequired={props.setIsListRefreshRequired}
          addToast={props.addToast}
          addItem={PushItem}
        />
      {content(data)}
    </div>
  );
};

export default Info;