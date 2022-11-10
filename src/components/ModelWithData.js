import Model from './model';
import { useEffect, useState } from 'react';
import { list, remove, put } from '../apiClient';
import { v4 as uuidv4 } from 'uuid';

export default function ModelWithData (props) {
    const DEBUG = true;
    const [data, setData] = useState([]);
    const [isInEditMode, setIsInEditMode] = useState(false);

    // Not working
    // const [cursor, setCursor] = useState('crosshair');

    // const CURSOR_TYPES = {
    //     pointer: 'pointer',
    //     crosshair: 'crosshair'
    // }
    // const changeCursor = (cursorType) => {
    //     setCursor(cursorType);
    // }

    useEffect(() => {
        if (props.isListRefreshRequired) {
          list()
            .then(response => response.json())
            .then(data => {
                if (DEBUG) {
                    console.log('Got data from api.list(): ', data);
                }
                setData(data.Items);
                props.addToast({"message": `Data refreshed`, "type": "success"});
            })
            .catch(error => props.addToast({"message": `Unable to refresh data: ${error.message}`, "type": "error"}));
          props.setLastUpdated(new Date());
          props.setIsListRefreshRequired(false);
        }
      });

    const addData = (dataPoint) => {
        if (!isInEditMode) {
            if (DEBUG) { console.log('Clicked model while not in edit mode.'); }
            return;
        }
        let newData;
        dataPoint.uuid = uuidv4();
        if (DEBUG) {
            console.log('Created UUID: ', dataPoint.uuid);
        }
        setData((d) => {
            newData = [...d, dataPoint];
            if (DEBUG) {
                console.log('Data:', newData);
            }

            return newData;
        });
        put(dataPoint, dataPoint.uuid)
            .then(response => response.json())
            .then((responseJson) => {
                if (DEBUG) {
                    console.log('Put data with api.put(). Response: ', responseJson);
                }
                if (responseJson.errorMessage) {
                    throw new Error(responseJson.errorMessage)
                }
                props.addToast({"message": `Added item`, "type": "success"})
            })
            .catch(error => props.addToast({"title": "Error", "message": `An error occurred: ${error.message}`, "type": "error"}));
        return newData;
    };

    const deleteDataById = (id) => {
        if(DEBUG) {console.log("deleteDataById: ", id) }
        if (!window.confirm("Delete annotation?")) {
            if(DEBUG) {console.log("Deletion cancelled by user: ", id) }
            return;
        }
        let newData;
        setData((d) => {
            newData = d.filter(a => a.uuid !== id);
            if (DEBUG) {
                console.log('Removed annotation: ', id);
                console.log('annotations:', newData);
            }
            return newData;
        });
        remove(id)
            .then(response => response.json())
            .then(() => props.addToast({"message": `Item deleted`, "type": "success"}))
            .catch(error => props.addToast({"message": `An error occurred: ${error.message}`, "type": "error"}));
        return newData;
    }

    const buttonStyle = {
        backgroundColor: '#FF0000',
        background: 'linear-gradient(130deg, #CC00CC 33%, #CCCC11 85%, #00FFCC 100%)',
        border: 'none',
        color: 'white',
        padding: '10px',
        textDecoration: 'none',
        margin: '4px 2px',
        // cursor: cursor
    };

    const editButtonText = isInEditMode ? "Done" : "+ Add new injury";
    const editButton = 
        <button 
            onClick={() => {
                setIsInEditMode(!isInEditMode);
                // setCursor(isInEditMode ? CURSOR_TYPES.crosshair : CURSOR_TYPES.pointer) // not working
            }}
            style={buttonStyle}
        >
            {editButtonText}
        </button>;
    const instructions = isInEditMode ? 
        <div>Click on the model to add a new injury</div> :
        null;

    return (
        <>
            <Model 
                data={data}
                addData={addData}
                deleteDataById={deleteDataById}
                // style={{cursor: cursor}}
            />
            <span>
                {editButton}
            </span>
            {instructions}
        </>
    );
}