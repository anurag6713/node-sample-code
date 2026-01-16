import fastJson from 'fast-json-stringify';

import {channelMemberBasicObject} from '@utils/schemas';

const schema: fastJson.ObjectSchema = {
    title: 'Channel Membership',
    type: 'object',
    properties: {
        data: channelMemberBasicObject,
        message: {type: 'string'},
    },
};

export default schema;
