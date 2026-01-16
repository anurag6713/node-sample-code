import fastJson from 'fast-json-stringify';

import {channelBasicObject} from '@utils/schemas';

const schema: fastJson.ObjectSchema = {
    title: 'Channels',
    type: 'object',
    properties: {
        data: {
            type: 'array',
            items: channelBasicObject,
        },
        message: {type: 'string'},
    },
};

export default schema;
