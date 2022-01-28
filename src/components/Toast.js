import react, { useEffect, useState } from "react";
import infoIcon from './../resources/icons/info.png';
import checkIcon from './../resources/icons/check.png';
import errorIcon from './../resources/icons/exclamation.png';

const Toast = (props) => {
    const [showToast, setShowToast] = useState(true);
    const handleXButtonClick = () => {
        setShowToast(false);
    }

    // console.log("Toast - ", "message: ", props.message, ", type: ", props.type, ", show: ", showToast);

    useEffect(() => {
        // todo: delete toast from list instead of just hiding
        setTimeout(() => setShowToast(false), 5000);
    }, [])

    let imgSrc;
    let backgroundColor;
    switch (props.type) {
        case 'info':
            imgSrc = infoIcon;
            backgroundColor = 'neutral';
            break;
        case 'success':
            imgSrc = checkIcon;
            backgroundColor = 'green';
            break;
        case 'error':
            imgSrc = errorIcon;
            backgroundColor = 'red';
            break;
        default:
            imgSrc = infoIcon;
            backgroundColor = 'neutral';
            break;
    }

    if (showToast) {
        return (
            <div className={`toast toast-${backgroundColor}`}>
                <div className="notification-image">
                    <img src={imgSrc} alt="" className="toast-icon" />
                </div>
                <div className="toast-content">
                    <p className="notification-message">{props.message}</p>
                </div>
                <button className="no-border" onClick={handleXButtonClick}>×</button>
            </div>
        )
    } else {
        return null;
    }
}

export default Toast;