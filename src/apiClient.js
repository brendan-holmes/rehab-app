
async function dynamoDbOperation(operation, payload = {}) {
    if ((operation !== "list") &&
    (operation !== "create")) {
        return null;
    }
    
    var headers = new Headers();
    headers.append("Content-Type", "application/json");
    
    const url = 'https://qqznn893v8.execute-api.ap-southeast-2.amazonaws.com/beta';
    var body = JSON.stringify({
        "operation": operation,
        "tableName": "rehab-app",
        "payload": payload
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
    return dynamoDbOperation("create", data);
}

function list() {
    return dynamoDbOperation("list");
}

export {put, list};