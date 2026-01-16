import fastJson from 'fast-json-stringify';

import {messageBasicObject} from '@utils/schemas';

const schema: fastJson.ObjectSchema = {
    title: 'Message',
    type: 'object',
    properties: {
        data: messageBasicObject,
        message: {type: 'string'},
    },
};

export default schema;
