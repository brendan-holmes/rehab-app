import { log } from './logging';
import { getJwt, parseJwt } from './identity';

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
    
    const jwt = getJwt();
    if (!jwt) {
        return Promise.reject(new Error('Unauthorized'));
    }

    var body = JSON.stringify({
        'operation': operation,
        'tableName': 'rehab-app',
        'payload': payload,
        'jwt': jwt
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
    const jwt = getJwt();
    if (!jwt) {
        return Promise.reject(new Error('Cannot add new item: Unauthorized'));
    }
    const jwtDecoded = parseJwt(jwt);
    if (!jwtDecoded) {
        return Promise.reject(new Error('Cannot add new item: Unauthorized'));
    }
    const email = jwtDecoded.email;
    if (!email) {
        return Promise.reject(new Error('Cannot add new item: Unauthorized'));
    }

    if (data && id) {
        const payload = {
            'Item': {
                ...data,
                'id': id,
                'email': email
            },
            
        }
        return dynamoDbOperation('create', payload);
    } else {
        return Promise.reject(new Error('Cannot add new item'));
    }
}

function list() {
    const jwt = getJwt();
    if (!jwt) {
        return Promise.reject(new Error('Cannot get list: Unauthorized'));
    }

    return dynamoDbOperation('list');
}

function remove(id) {
    const jwt = getJwt();
    if (!jwt) {
        return Promise.reject(new Error('Cannot remove item: Unauthorized'));
    }

    if (id) {
        const payload = {
            'Key': { 'id': id }
        }
        return dynamoDbOperation('delete', payload);    
    } else {
        return Promise.reject(new Error('Cannot remove'));
    }
}

export { put, list, remove };