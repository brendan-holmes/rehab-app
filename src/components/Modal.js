export default function Modal(props) {

    return (
        <div 
            onClick={props.handleClose}
            className="modal-outside-area"
            >

            <div className="modal-inside-area">

                <button onClick={props.handleClose} className="modal-button">Close ✕</button>

                <div className="modal-content-area">

                    {props.children}

                </div>

            </div>

        </div>
        
    );
}