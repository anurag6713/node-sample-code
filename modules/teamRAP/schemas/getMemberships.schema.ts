import fastJson from 'fast-json-stringify';

import {teamMemberRAPBasicObject} from '@utils/schemas';

const schema: fastJson.ObjectSchema = {
    title: 'Team RAP Memberships',
    type: 'object',
    properties: {
        data: {
            type: 'array',
            items: teamMemberRAPBasicObject,
        },
        message: {type: 'string'},
    },
};

export default schema;
