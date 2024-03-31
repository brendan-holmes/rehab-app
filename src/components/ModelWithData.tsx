import React from 'react';
import IAnnotation from '../interfaces/IAnnotation';
import IModelData from '../interfaces/IModelData';
import Model from './Model';

const { useEffect, useState } = require('react');
const { list, remove, put } = require('../apiClient');
const { logInfo, logError } = require('../logging');


interface IModelWithDataProps {
    isListRefreshRequired: boolean;
    setIsListRefreshRequired: (isListRefreshRequired: boolean) => void;
    addToast: (toast: any) => void;
}

export default function ModelWithData (props: IModelWithDataProps) {
    const [annotations, setAnnotations] = useState([]);
    const [tempAnnotation, setTempAnnotation] = useState(null);
    const [labelInEdit, setLabelInEdit] = useState('');

    const TEMP_ANNOTATION_ID = 'abc';

    useEffect(() => {
        if (props.isListRefreshRequired) {
          list()
            .then((response: Response) => response.json())
            .then((modelData: IModelData) => {
                logInfo('Got data from api.list(): ', modelData);
                setAnnotations(modelData.Items);
                props.addToast({"message": `Data refreshed`, "type": "success"});
            })
            .catch((error: Error) => props.addToast({"message": `Unable to refresh data: ${error.message}`, "type": "error"}));
          props.setIsListRefreshRequired(false);
        }
      });
    
    const handleModelClick = (annotation: IAnnotation) => {
        if (labelInEdit) {
            setLabelInEdit('');
            setTempAnnotation({});
            return;
        }
        addTempAnnotation(annotation);
    }

    const handleBackgroundClick = () => {
        setTempAnnotation(null);
        setLabelInEdit('');
    }

    const handleLabelClick = (id: string) => {
        setLabelInEdit(id);
    }

    // Every annotation is first added as a temporary annotation,
    // and then gets persisted once it has been named
    const addTempAnnotation = (dataPoint: IAnnotation) => {
        logInfo('Setting temp annotation: ', dataPoint);

        dataPoint.id = TEMP_ANNOTATION_ID;
        dataPoint.timestamp = new Date().toUTCString();
        setTempAnnotation(dataPoint);
        setLabelInEdit(dataPoint.id);
    }
    
    const updateAnnotation = (annotation: IAnnotation) => {
        logInfo('Name Temp Annotation');
        persistAnnotation(annotation);
        setTempAnnotation(null);
    }
    
    const persistAnnotation = (annotationWithId: IAnnotation) => {
        if (!annotationWithId.id) {
            logError('Attempting to persist an annotation that doesn\'t have a id.');
            return;
        }
        if (!annotationWithId.name) {
            annotationWithId.name = "Unnamed injury";
        }
        let newData;
        logInfo('Created ID: ', annotationWithId.id);

        put(annotationWithId, annotationWithId.id)
            .then((response: Response) => response.json())

            // todo
            .then((responseJson: any) => {
                logInfo('Put data with api.put(). Response: ', responseJson);
                if (responseJson.errorMessage) {
                    throw new Error(responseJson.errorMessage)
                }
                props.addToast({"message": `Added injury`, "type": "success"})
            })
            .catch((error: Error) => props.addToast({"title": "Error", "message": `An error occurred: ${error.message}`, "type": "error"}));
        setLabelInEdit('');
        props.setIsListRefreshRequired(true);
        return newData;
    };

    const deleteAnnotationById = (id: string) => {
        if (isTempAnnotation(id)) {
            logInfo('Removing temp annotation');
            setTempAnnotation(null);
            return;
        }

        logInfo("deleteDataById: ", id);
        const name = annotations.filter((a: IAnnotation) => a.id === id)[0].name || 'injury';
        if (!window.confirm(`Delete ${name}?`)) {
            logInfo("Deletion cancelled by user: ", id);
            return;
        }
        let newData;
        setAnnotations((existingAnnotations: IAnnotation[]) => {
            logInfo(existingAnnotations);
            newData = existingAnnotations.filter(annotation => annotation.id !== id);
            logInfo('Removed annotation: ', id);
            logInfo('annotations:', newData);
            return newData;
        });
        remove(id)
            .then((response: Response) => response.json())
            .then(() => props.addToast({"message": `Deleted injury`, "type": "success"}))
            .catch((error: Error) => props.addToast({"message": `An error occurred: ${error.message}`, "type": "error"}));
        return newData;
    }

    const isTempAnnotation = (id: string) => {
        return tempAnnotation && tempAnnotation.id && id && (id === tempAnnotation.id);
    }

    return (
        <Model 
            annotations={annotations}
            tempAnnotation={tempAnnotation}
            handleModelClick={handleModelClick}
            deleteDataById={deleteAnnotationById}
            handleRename={updateAnnotation}
            handleBackgroundClick={handleBackgroundClick}
            labelInEdit={labelInEdit}
            handleLabelClick={handleLabelClick}
        />
    );
}