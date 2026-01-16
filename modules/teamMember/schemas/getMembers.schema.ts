import fastJson from 'fast-json-stringify';

import {userBasicObject} from '@utils/schemas';

const schema: fastJson.ObjectSchema = {
    title: 'Channel Members',
    type: 'object',
    properties: {
        data: {
            type: 'array',
            items: userBasicObject,
        },
        message: {type: 'string'},
    },
};

export default schema;
