import { logInfo } from './logging';
import { getJwt, parseJwt } from './identity';
import { v4 as uuid } from 'uuid';
import { IAnnotation } from './interfaces/IAnnotation';
import { IJwt } from './interfaces/IJwt';

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
    Items: IAnnotation[];
}

async function dynamoDbOperation(operation: string, payload: IDynamoDBPayload = {}): Promise<Response> {
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

    // todo: use a more specific type for requestOptions
    var requestOptions: RequestInit = {
        method: 'POST',
        headers: headers,
        body: body,
        redirect: 'follow'
    };

    return await fetch(url, requestOptions);
}

export function put(data: IAnnotation, id: string): Promise<Response> {
    const jwt = getJwt();
    if (!jwt) {
        return Promise.reject(new Error('Cannot add new item: Unauthorized'));
    }

    const jwtDecoded: IJwt = parseJwt(jwt);
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
                'id': uuid(),
                'email': email
            },
        }
        return dynamoDbOperation('create', payload);
    } else {
        return Promise.reject(new Error('Cannot add new item'));
    }
}

export function list(): Promise<IAnnotation[]> {
    const jwt = getJwt();
    if (!jwt) {
        throw new Error('Cannot get list: Unauthorized');
    }

    return dynamoDbOperation('list').then((response): Promise<IAnnotation[]> => {
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

export function remove(id: string): Promise<Response> {
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
