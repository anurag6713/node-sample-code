import fastJson from 'fast-json-stringify';

import {wsfy} from '@utils/schemas';

import getMembers from './getMembers.schema';
import getMembership from './getMembership.schema';
import getMemberships from './getMemberships.schema';

export default {
    getMembers: fastJson(getMembers),
    getMembersWS: fastJson(
        wsfy(getMembers.properties.data as fastJson.ObjectSchema),
    ),
    getMembership: fastJson(getMembership),
    getMembershipWS: fastJson(
        wsfy(getMembership.properties.data as fastJson.ObjectSchema),
    ),
    getMemberships: fastJson(getMemberships),
    getMembershipsWS: fastJson(
        wsfy(getMemberships.properties.data as fastJson.ObjectSchema),
    ),
};
