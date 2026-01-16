import fastJson from 'fast-json-stringify';

import {teamBasicObject} from '@utils/schemas';

const schema: fastJson.ObjectSchema = {
    title: 'Get Teams List',
    type: 'object',
    properties: {
        data: {
            type: 'array',
            items: teamBasicObject,
        },
        message: {type: 'string'},
    },
};

export default schema;
