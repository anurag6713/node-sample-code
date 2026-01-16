import fastJson from 'fast-json-stringify';

import {teamInviteBasicObject} from '@utils/schemas';

const schema: fastJson.ObjectSchema = {
    title: 'Get Team Invites',
    type: 'object',
    properties: {
        data: {
            type: 'array',
            items: teamInviteBasicObject,
        },
        message: {type: 'string'},
    },
};

export default schema;
