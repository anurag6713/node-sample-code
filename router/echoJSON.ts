import uWebSockets from 'uWebSockets.js';

import type {Response, Schema} from '@customTypes';

function echoJSON(
    response: uWebSockets.HttpResponse,
    responseObj: Response | void,
    schema?: Schema,
): uWebSockets.HttpResponse {
    if (responseObj) {
        response.statusCode = responseObj.status || 200;
        response.writeStatus(response.statusCode + '');
        response.writeHeader('content-type', 'application/json');
        response.writeHeader('Access-Control-Allow-Origin', '*');
        response.writeHeader('Access-Control-Allow-Headers', '*');
        delete responseObj.status;
        response.end(
            schema ? schema(responseObj) : JSON.stringify(responseObj),
        );
        return response;
    }
}

export default echoJSON;
