import React, { useEffect, useState } from 'react';
import {list} from '../apiClient.js';
import InfoCard from './InfoCard.js';
import Form from './Form.js';

const Info = (props) => {
  const [data, setData] = useState([]);

  const PushItem = (newItem) => {
    setData([...data, newItem])
  }

  // todo: Use IDs instead of indexes which can get out of whack
  const UpdateItem = (updatedItem) => {
    const index = data.findIndex(i => i.id === updatedItem.id);
    if (index > -1) {
        let dataShallowCopy = [...data];
        dataShallowCopy[index] = updatedItem;
        setData(dataShallowCopy);
    }
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
    if (data !== null) {      
      if (data && Array.isArray(data)) {
        return (
          <ul>
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
              index: index,
              key: index,
              // setIsListRefreshRequired: props.setIsListRefreshRequired,
              addToast: props.addToast,
              setData: setData,
              data: data,
              updateItem: UpdateItem
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
      <div className="info-content">
        {content(data)}
      </div>
    </div>
  );
};

export default Info;