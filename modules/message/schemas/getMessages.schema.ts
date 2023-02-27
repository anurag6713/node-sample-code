import fastJson from 'fast-json-stringify';

import {messageBasicObject, userBasicObject} from '@utils/schemas';

const schema: fastJson.ObjectSchema = {
    title: 'Get Messages',
    type: 'object',
    properties: {
        data: {
            type: 'object',
            properties: {
                messages: {
                    type: 'array',
                    items: messageBasicObject,
                },
                updated: {
                    type: 'array',
                    items: messageBasicObject,
                },
                deleted: {
                    type: 'array',
                    items: messageBasicObject,
                },
                users: {
                    type: 'array',
                    items: userBasicObject,
                },
                lastMessageAt: {type: 'number'},
            },
        },
        message: {type: 'string'},
    },
};

export default schema;
