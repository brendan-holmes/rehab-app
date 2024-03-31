import React from 'react';
import Toast from "./Toast";
import IToast from "../interfaces/IToast";

interface IToastContainerProps {
    toastList: IToast[];
}

const ToastContainer = (props: IToastContainerProps) => {
    if (Array.isArray(props.toastList)) {
        return (
            <div className="toast-container">
                {props.toastList.map((toast, index) => <Toast key={index} title={toast.title} message={toast.message} type={toast.type}/>)}
            </div>
        );
    } 
    else 
    {
        return null
    }
}

export default ToastContainer;