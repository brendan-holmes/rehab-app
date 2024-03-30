import Model from './Model';
import { useEffect, useState } from 'react';
import { list, remove, put } from '../apiClient';
import { logInfo, logError } from '../logging';

export default function ModelWithData (props) {
    const [data, setData] = useState([]);
    const [tempAnnotation, setTempAnnotation] = useState({});
    const [labelInEdit, setLabelInEdit] = useState(null);

    const TEMP_ANNOTATION_ID = 'abc';

    useEffect(() => {
        if (props.isListRefreshRequired) {
          list()
            .then(response => response.json())
            .then(data => {
                logInfo('Got data from api.list(): ', data);
                setData(data.Items || []);
                props.addToast({"message": `Data refreshed`, "type": "success"});
            })
            .catch(error => props.addToast({"message": `Unable to refresh data: ${error.message}`, "type": "error"}));
          props.setIsListRefreshRequired(false);
        }
      });
    
    const handleModelClick = (annotation) => {
        if (labelInEdit) {
            setLabelInEdit(null);
            setTempAnnotation({});
            return;
        }
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
        logInfo('Setting temp annotation: ', dataPoint);

        dataPoint.id = TEMP_ANNOTATION_ID;
        dataPoint.timestamp = new Date().toUTCString();
        setTempAnnotation(dataPoint);
        setLabelInEdit(dataPoint.id);
    }
    
    const updateAnnotation = (annotation) => {
        logInfo('Name Temp Annotation');
        persistAnnotation(annotation);
        setTempAnnotation({});
    }
    
    const persistAnnotation = (annotationWithId) => {
        if (!annotationWithId.id) {
            logError('Attempting to persist an annotation that doesn\'t have a id.');
            return;
        }
        if (!annotationWithId.name) {
            annotationWithId.name = "Unnamed injury";
        }
        let newData;
        logInfo('Created ID: ', annotationWithId.id);
        setData((d) => {
            // In the case of an update, remove the existing version
            newData = d.filter(a => a.id !== annotationWithId.id);
            // append the new annotation or new version to the data list
            newData = [...newData, annotationWithId];
            logInfo('Data:', newData);

            return newData;
        });
        put(annotationWithId, annotationWithId.id)
            .then(response => response.json())
            .then((responseJson) => {
                logInfo('Put data with api.put(). Response: ', responseJson);
                if (responseJson.errorMessage) {
                    throw new Error(responseJson.errorMessage)
                }
                props.addToast({"message": `Added injury`, "type": "success"})
            })
            .catch(error => props.addToast({"title": "Error", "message": `An error occurred: ${error.message}`, "type": "error"}));
        setLabelInEdit(null);
        return newData;
    };

    const deleteAnnotationById = (id) => {
        if (isTempAnnotation(id)) {
            logInfo('Removing temp annotation');
            setTempAnnotation({});
            return;
        }

        logInfo("deleteDataById: ", id);
        const name = data.filter(a => a.id === id)[0].name || 'injury';
        logInfo("deleteDataById: ", id);
        if (!window.confirm(`Delete ${name}?`)) {
            logInfo("Deletion cancelled by user: ", id);
            return;
        }
        let newData;
        setData((d) => {
            newData = d.filter(a => a.id !== id);
            logInfo('Removed annotation: ', id);
            logInfo('annotations:', newData);
            return newData;
        });
        remove(id)
            .then(response => response.json())
            .then(() => props.addToast({"message": `Deleted injury`, "type": "success"}))
            .catch(error => props.addToast({"message": `An error occurred: ${error.message}`, "type": "error"}));
        return newData;
    }

    const isTempAnnotation = (id) => {
        return tempAnnotation.id && id && id === tempAnnotation.id;
    }

    return (
        <>
            <Model 
                data={data}
                tempAnnotation={tempAnnotation}
                handleModelClick={handleModelClick}
                deleteDataById={deleteAnnotationById}
                handleRename={updateAnnotation}
                handleBackgroundClick={handleBackgroundClick}
                labelInEdit={labelInEdit}
                handleLabelClick={handleLabelClick}
            />
        </>
    );
}