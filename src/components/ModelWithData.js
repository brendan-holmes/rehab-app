import Model from './model';
import { useEffect, useState } from 'react';
import { list, remove, put } from '../apiClient';
import { v4 as uuidv4 } from 'uuid';

export default function ModelWithData (props) {
    const DEBUG = false;
    const [data, setData] = useState([]);
    const [tempAnnotation, setTempAnnotation] = useState({});
    const [labelInEdit, setLabelInEdit] = useState(null);

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
    
    const handleModelClick = (annotation) => {
        addTempAnnotation(annotation);
    }

    const handleBackgroundClick = () => {
        setTempAnnotation({});
        setLabelInEdit(null);
    }

    const handleLabelClick = (id) => {
        setLabelInEdit(id);
    }

    // Every annotation is first added as a temporary annotation,
    // and then gets persisted once it has been named
    const addTempAnnotation = (dataPoint) => {
        if(DEBUG) {console.log("Setting temp annotation: ", dataPoint) }
        dataPoint.name = "Unnamed injury";
        dataPoint.uuid = uuidv4();
        setTempAnnotation(dataPoint);
        setLabelInEdit(dataPoint.uuid);
    }

    const nameTempAnnotation = (annotation) => {
        if (DEBUG) { console.log('Name Temp Annotation'); }
        persistAnnotation(tempAnnotation);
        setTempAnnotation({});
    }

    const persistAnnotation = (annotationWithUuid) => {
        if (!annotationWithUuid.uuid) {
            if (DEBUG) { console.error('Attempting to persist an annotation that doesn\'t have a uuid.'); }
            return;
        }
        let newData;
        if (DEBUG) {
            console.log('Created UUID: ', annotationWithUuid.uuid);
        }
        setData((d) => {
            newData = [...d, annotationWithUuid];
            if (DEBUG) {
                console.log('Data:', newData);
            }

            return newData;
        });
        put(annotationWithUuid, annotationWithUuid.uuid)
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
        setLabelInEdit(null);
        return newData;
    };

    const deleteAnnotationById = (id) => {
        if (isTempAnnotation(id)) {
            if (DEBUG) {
                console.log('Removing temp annotation');
            }
            setTempAnnotation({});
            return;
        }

        if(DEBUG) {console.log("deleteDataById: ", id) }
        const name = data.filter(a => a.uuid === id)[0].name || 'injury';
        if(DEBUG) {console.log("deleteDataById: ", id) }
        if (!window.confirm(`Delete ${name}?`)) {
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

    const isTempAnnotation = (id) => {
        return tempAnnotation.uuid && id && id === tempAnnotation.uuid;
    }

    const buttonStyle = {
        backgroundColor: '#FF0000',
        background: 'linear-gradient(130deg, #CC00CC 33%, #CCCC11 85%, #00FFCC 100%)',
        border: 'none',
        color: 'white',
        padding: '10px',
        textDecoration: 'none',
        margin: '4px 2px'
    };

    return (
        <>
            <Model 
                data={data}
                tempAnnotation={tempAnnotation}
                handleModelClick={handleModelClick}
                deleteDataById={deleteAnnotationById}
                handleRename={nameTempAnnotation}
                handleBackgroundClick={handleBackgroundClick}
                labelInEdit={labelInEdit}
                handleLabelClick={handleLabelClick}
            />
        </>
    );
}