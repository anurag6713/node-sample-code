import fastJson from 'fast-json-stringify';

import {teamBasicObject} from '@utils/schemas';

const schema: fastJson.ObjectSchema = {
    title: 'Team',
    type: 'object',
    properties: {
        data: teamBasicObject,
        message: {type: 'string'},
    },
};

export default schema;
