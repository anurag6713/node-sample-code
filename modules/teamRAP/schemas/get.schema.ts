import fastJson from 'fast-json-stringify';

import {teamRAPBasicObject} from '@utils/schemas';

const schema: fastJson.ObjectSchema = {
    type: 'object',
    properties: {
        data: teamRAPBasicObject,
        message: {type: 'string'},
    },
};

export default schema;
