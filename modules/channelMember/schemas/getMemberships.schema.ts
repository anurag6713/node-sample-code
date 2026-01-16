import fastJson from 'fast-json-stringify';

import {channelMemberBasicObject} from '@utils/schemas';

const schema: fastJson.ObjectSchema = {
    type: 'object',
    properties: {
        data: {
            type: 'array',
            items: channelMemberBasicObject,
        },
        message: {type: 'string'},
    },
};

export default schema;
