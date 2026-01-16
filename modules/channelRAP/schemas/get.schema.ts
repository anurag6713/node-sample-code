import fastJson from 'fast-json-stringify';

import {channelRAPBasicObject} from '@utils/schemas';

const schema: fastJson.ObjectSchema = {
    type: 'object',
    properties: {
        data: channelRAPBasicObject,
        message: {type: 'string'},
    },
};

export default schema;
