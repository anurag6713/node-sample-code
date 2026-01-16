import fastJson from 'fast-json-stringify';

import {teamMemberBasicObject} from '@utils/schemas';

const schema: fastJson.ObjectSchema = {
    title: 'Channel Memberships',
    type: 'object',
    properties: {
        data: {
            type: 'array',
            items: teamMemberBasicObject,
        },
        message: {type: 'string'},
    },
};

export default schema;
