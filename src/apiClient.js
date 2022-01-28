
async function dynamoDbOperation(operation, payload = {}) {
    if (
        (operation !== 'list') &&
        (operation !== 'create') &&
        (operation !== 'delete')
        ) {
            console.log('Invalid dynamo operation.');
        return null;
    }
    
    var headers = new Headers();
    headers.append('Content-Type', 'application/json');
    
    const url = 'https://qqznn893v8.execute-api.ap-southeast-2.amazonaws.com/beta';
    var body = JSON.stringify({
        'operation': operation,
        'tableName': 'rehab-app',
        'payload': payload
    });

    var requestOptions = {
        method: 'POST',
        headers: headers,
        body: body,
        redirect: 'follow'
    };

    try {
        const response = await fetch(url, requestOptions);
        const data = await response.json();
        return data;
    } catch (error) {
        return error;
    }
}

function put(data) {
    const payload = {
        'Item': {
            ...data
        }
    }
    console.log('payload: ', payload);
    return dynamoDbOperation('create', payload);
}

function list() {
    return dynamoDbOperation('list');
}

function remove(id) {
    if (id) {
        const payload = {
            'Key': { 'id': id }
        }
        return dynamoDbOperation('delete', payload);    
    }
}

export {put, list, remove};