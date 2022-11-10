import deleteIcon from './../resources/icons/x.png';

export default function AnnotationLabel(props) {
    const labelStyle = {
        backgroundColor: '#FF0000',
        background: 'linear-gradient(130deg, #CC00CC 33%, #CCCC11 85%, #00FFCC 100%)',
        border: 'none',
        color: 'white',
        padding: '10px',
        textDecoration: 'none',
        margin: '4px 2px'
    };

    return (
        <button
            id = {`${props.annotation.uuid}-label`}
            className = "view-button"
            slot = {`hotspot-${props.annotation.uuid}-label`}
            data-position = {props.dataPosition}
            data-normal = {props.dataNormal}
            style = {labelStyle}
            onClick = {props.handleClick}
        >
            <span>{`Injury name`}</span>
            <img 
                className="info-card-tool-button" 
                src={deleteIcon} 
                alt="" 
                onClick={(e) => props.handleDeleteClick(e, props.annotation.uuid)}
            />
        </button>
        )}