import React from 'react';

interface IModalProps {
    handleClose: () => void;
    children: React.ReactNode;
}

export function Modal(props: IModalProps) {

    return (
        <div onClick={props.handleClose} className="modal-outside-area">
            <div className="modal-inside-area">
                <button onClick={props.handleClose} className="modal-button">Close ✕</button>
                <div className="modal-content-area">
                    {props.children}
                </div>
            </div>
        </div>
    );
}
