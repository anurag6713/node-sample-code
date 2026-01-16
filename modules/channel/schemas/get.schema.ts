import fastJson from 'fast-json-stringify';

import {channelBasicObject} from '@utils/schemas';

const schema: fastJson.ObjectSchema = {
    title: 'Channel',
    type: 'object',
    properties: {
        data: channelBasicObject,
        message: {type: 'string'},
    },
};

export default schema;
