import fastJson from 'fast-json-stringify';

import {userBasicObject} from '@utils/schemas';

const schema: fastJson.ObjectSchema = {
    title: 'Get User Token',
    type: 'object',
    properties: {
        data: {
            type: 'object',
            properties: {
                ...userBasicObject['properties'],
                token: {type: 'string'},
            },
        },
        message: {type: 'string'},
    },
};

export default schema;
