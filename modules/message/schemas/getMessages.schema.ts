import fastJson from 'fast-json-stringify';

import {messageBasicObject, userBasicObject} from '@utils/schemas';

const schema: fastJson.ObjectSchema = {
    title: 'Messages',
    type: 'object',
    properties: {
        data: {
            type: 'object',
            properties: {
                deleted: {
                    type: 'array',
                    items: messageBasicObject,
                },
                lastMessageAt: {type: 'number'},
                messages: {
                    type: 'array',
                    items: messageBasicObject,
                },
                updated: {
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
