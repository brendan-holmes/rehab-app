import { logInfo } from './logging';
import { v4 as uuid } from 'uuid';
import { Annotation } from './types/Annotation';
import { IdToken } from '@auth0/auth0-spa-js';

interface IDynamoDBPayload {
    Item?: IDynamoDBItem;
    Key?: IDynamoDBKey;
}

interface IDynamoDBItem {
    id: string;
    email: string;
}

interface IDynamoDBKey {
    id: string;
}

interface IDynamoDBListResponse {
    Items: Annotation[];
}

async function  dynamoDbOperation(idToken: IdToken, operation: string, payload: IDynamoDBPayload = {}): Promise<Response> {
    
    const url = 'https://qqznn893v8.execute-api.ap-southeast-2.amazonaws.com/beta';
    
    if (
        (operation !== 'list') &&
        (operation !== 'create') &&
        (operation !== 'delete') &&
        (operation !== 'update')
        ) {
            logInfo('Invalid dynamo operation');
            return Promise.reject(new Error('Invalid dynamo operation'));
    }
    
    var headers = new Headers();
    headers.append('Content-Type', 'application/json');

    var body = JSON.stringify({
        'operation': operation,
        'tableName': 'rehab-app',
        'payload': payload,
        'jwt': idToken.__raw
    });

    // todo: use a more specific type for requestOptions
    var requestOptions: RequestInit = {
        method: 'POST',
        headers: headers,
        body: body,
        redirect: 'follow'
    };

    return await fetch(url, requestOptions);
}

export function put(idToken: IdToken, data: Annotation, id: string): Promise<Response> {

    if (idToken.email === undefined) {
        throw new Error('idToken is undefined');
    }

    if (data && id) {
        const payload = {
            'Item': {
                ...data,
                'id': uuid(),
                'email': idToken.email
            }
        }
        return dynamoDbOperation(idToken, 'create', payload);
    } else {
        return Promise.reject(new Error('Cannot add new item'));
    }
}

export function list(idToken: IdToken): Promise<Annotation[]> {
    return dynamoDbOperation(idToken, 'list').then((response): Promise<Annotation[]> => {
        if (!response.ok) {
            throw new Error('Cannot get list');
        }

        return response.json().then((data: IDynamoDBListResponse) => {
            return data.Items;
        });
    }).catch((error) => {
        throw new Error(`Cannot get list: ${error}`);
    });
}

export function remove(idToken: IdToken, id: string): Promise<Response> {
    if (id) {
        const payload = {
            'Key': { 'id': id }
        }
        return dynamoDbOperation(idToken, 'delete', payload);    
    } else {
        return Promise.reject(new Error('Cannot remove'));
    }
}
