const CardField = (props) => {

    // todo: use IDs instead of indexes, which can get out of whack
    const handleEdit = (event) => {
        const index = props.inputs.findIndex(i => i.name === event.target.id);
        if (index > -1) {
            let inputsShallowCopy = [...props.inputs];
            let input = {...props.inputs[index]}
            input.value = event.target.value;
            inputsShallowCopy[index] = input;
            props.setInputs(inputsShallowCopy);
        }
    }

    if (props.isInEdit) {
        return (
            <p>
                <strong>{props.name}</strong> <input className="form-input" type='number' id={props.name} value={props.inputs.find(i => i.name === props.name).value} placeholder="Enter a number" onChange={handleEdit}/>
            </p>
        );
    } else {
        return (
            <p>
                <strong>{props.name}</strong> {props.value}
            </p>
        )
    }
}

export default CardField;