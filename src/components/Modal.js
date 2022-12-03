import { findByLabelText } from '@testing-library/react';

export default function Modal(props) {

    const outsideAreaStyle = {
        position: 'fixed',
        height: '100vh',
        width: '100vw',
        background: 'rgba(190, 190, 190, 0.5)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
    };

    const insideAreaStyle = {
        padding: '2vh',
        background: 'white',
        borderRadius: '5px',
        height: '50vh',
        width: '50vw',
        boxShadow: '0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)',
        // display: 'flow'
    };

    const contentAreaStyle = {
        padding: '5vh',
        display: 'flex',
        justifyContent: 'space-between',
        flexDirection: 'column',
        alignItems: 'center',
        height: '100%'
    }

    const buttonStyle = {
        display: 'block',
        marginLeft: 'auto',
        marginRight: '0'
    }

    return (
        <div style={outsideAreaStyle} onClick={props.handleClose}>

            <div style={insideAreaStyle}>

                <button onClick={props.handleClose} style={buttonStyle}>Close ✕</button>

                <div style={contentAreaStyle}>

                    {props.children}

                </div>

            </div>

        </div>
        
    );
}