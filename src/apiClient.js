import { log } from './logging';

async function dynamoDbOperation(operation, payload = {}) {
    const url = 'https://qqznn893v8.execute-api.ap-southeast-2.amazonaws.com/beta';
    
    if (
        (operation !== 'list') &&
        (operation !== 'create') &&
        (operation !== 'delete') &&
        (operation !== 'update')
        ) {
            log('Invalid dynamo operation.');
        return null;
    }
    
    var headers = new Headers();
    headers.append('Content-Type', 'application/json');
    
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

    return await fetch(url, requestOptions);
}

function put(data, id) {
    if (data && id) {
        const payload = {
            'Item': {
                ...data,
                'id': id
            },
            
        }
        return dynamoDbOperation('create', payload);
    } else {
        return Promise.reject(new Error('Cannot add new item'));
    }
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
    } else {
        return Promise.reject(new Error('Cannot remove'));
    }
}

function update(data) {
    if (data.id) {
        const payload = {
            'Key': { 'id': data.id },
            'UpdateExpression': 'set A= :a, B = :b',
            'ExpressionAttributeValues':
            {
                ':a': data.A,
                ':b': data.B
            }
        }
        return dynamoDbOperation('update', payload);    
    } else {
        return Promise.reject(new Error("Cannot update"));
    }
}

export { put, list, remove, update };