import fastJson from 'fast-json-stringify';

import {messageBasicObject, userBasicObject} from '@utils/schemas';

const schema: fastJson.ObjectSchema = {
    title: 'New Message',
    type: 'object',
    properties: {
        data: {
            type: 'object',
            properties: {
                lastMessageAt: {type: 'number'},
                messages: {
                    type: 'array',
                    items: messageBasicObject,
                },
                users: {
                    type: 'array',
                    items: userBasicObject,
                },
            },
        },
        message: {type: 'string'},
    },
};

export default schema;
