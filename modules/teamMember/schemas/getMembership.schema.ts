import fastJson from 'fast-json-stringify';

import {teamMemberBasicObject} from '@utils/schemas';

const schema: fastJson.ObjectSchema = {
    title: 'Team Membership',
    type: 'object',
    properties: {
        data: teamMemberBasicObject,
        message: {type: 'string'},
    },
};

export default schema;
