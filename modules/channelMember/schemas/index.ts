import fastJson from 'fast-json-stringify';

import {wsfy} from '@utils/schemas';

import addMembers from './addMembers.schema';
import getMembership from './getMembership.schema';
import getMemberships from './getMemberships.schema';
import unreadsCount from './unreadsCount.schema';

export default {
    addMembers: fastJson(addMembers),
    getMembership: fastJson(getMembership),
    getMembershipWS: fastJson(
        wsfy(getMembership.properties.data as fastJson.ObjectSchema),
    ),
    getMemberships: fastJson(getMemberships),
    getMembershipsWS: fastJson(
        wsfy(getMemberships.properties.data as fastJson.ObjectSchema),
    ),
    unreadsCount: fastJson(unreadsCount),
    unreadsCountWS: fastJson(
        wsfy(unreadsCount.properties.data as fastJson.ObjectSchema),
    ),
};
