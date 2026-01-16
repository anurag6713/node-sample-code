import fastJson from 'fast-json-stringify';

import {userBasicObject} from '@utils/schemas';

const schema: fastJson.ObjectSchema = {
    title: 'User',
    type: 'object',
    properties: {
        data: userBasicObject,
        message: {type: 'string'},
    },
};

export default schema;
