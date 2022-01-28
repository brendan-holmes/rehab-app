import Toast from "./Toast";

const ToastContainer = (props) => {
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