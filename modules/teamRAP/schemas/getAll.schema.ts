import fastJson from 'fast-json-stringify';

import {teamRAPBasicObject} from '@utils/schemas';

const schema: fastJson.ObjectSchema = {
    title: 'Get Roles',
    type: 'object',
    properties: {
        data: {
            type: 'array',
            items: teamRAPBasicObject,
        },
        message: {type: 'string'},
    },
};

export default schema;
