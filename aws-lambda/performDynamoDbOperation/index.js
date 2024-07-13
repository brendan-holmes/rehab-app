const AWS = require('aws-sdk');

const dynamo = new AWS.DynamoDB.DocumentClient();

const enableSignInFeature = true;

/**
 * Provide an event that contains the following keys:
 *
 *   - operation: one of the operations in the switch statement below
 *   - tableName: required for operations that interact with DynamoDB
 *   - payload: a parameter to pass to the operation being performed
 */
exports.handler = async (event) => {
    let jwtDecoded;
    if ( enableSignInFeature ) {
        const jwt = event.jwt;
        if (!jwt) {
            throw new Error(`Unauthorised: no JWT`);
        }
        
        jwtDecoded = parseJwt(jwt);
        
        if (!jwtDecoded.email) {
            throw new Error(`Unauthorised: invalid JWT`);
        }
    }

    const operation = event.operation;
    let params = event.payload;

    if (event.tableName) {
        params.TableName = event.tableName;
    }

    switch (operation) {
        case 'create':
            return await dynamo.put(params).promise();
        case 'read':
            return await dynamo.get(params).promise();
        case 'delete':
            return await dynamo.delete(params).promise();
        case 'list':
            if (enableSignInFeature) {
                params = addEmailFilter( params, jwtDecoded.email );
            }
            return await dynamo.scan(params).promise();
        default:
            throw new Error(`Unrecognized operation "${operation}"`);
    }
};

function parseJwt (token) {
    return JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString());
}

function addEmailFilter ( params, email ) {
    if ( email ) {
        params.FilterExpression = '#email = :email';
        params.ExpressionAttributeNames = { 
            "#email": "email"
        };
        params.ExpressionAttributeValues = { 
            ":email": email
        };
    }
    return params;
}

function isJwtExpired ( jwt ) {
    if ( ! ( jwt && jwt.exp ) ) {
        return true;
    }
    
    // jwt.exp is number of seconds since EPOCH
    if ( Date.now() >= jwt.exp * 1000 ) {
      return true;
    }
    
    return false;
}