import fastJson from 'fast-json-stringify';

import {wsfy} from '@utils/schemas';

import getInvite from './getInvite.schema';
import getInvites from './getInvites.schema';

export default {
    getInviteWS: fastJson(
        wsfy(getInvite.properties.data as fastJson.ObjectSchema),
    ),
    getInvitesWS: fastJson(
        wsfy(getInvites.properties.data as fastJson.ObjectSchema),
    ),
};
