import fastJson from 'fast-json-stringify';

import {teamInviteBasicObject} from '@utils/schemas';

const schema: fastJson.ObjectSchema = {
    title: 'Team',
    type: 'object',
    properties: {
        data: teamInviteBasicObject,
        message: {type: 'string'},
    },
};

export default schema;
