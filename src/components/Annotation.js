export default function Annotation(props) {
    const annotationStyle = {
        background: '#D9594C',
        backgroundColor: '#04AA6D',
        border: 'none',
        color: 'white',
        padding: '10px',
        textDecoration: 'none',
        margin: '4px 2px',
        borderRadius: '50%'
    };

    return  (
        <button
            id = {props.annotation.uuid}
            className = "view-button"
            slot = {`hotspot-${props.annotation.uuid}`}
            data-position = {props.dataPosition}
            data-normal = {props.dataNormal}
            style = {annotationStyle}
            onClick = {props.handleAnnotationClick}
        />
    )
}