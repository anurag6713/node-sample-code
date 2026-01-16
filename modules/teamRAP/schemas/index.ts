import fastJson from 'fast-json-stringify';

import {wsfy} from '@utils/schemas';

import get from './get.schema';
import getAll from './getAll.schema';
import getMemberships from './getMemberships.schema';

export default {
    getAll: fastJson(getAll),
    getAllWS: fastJson(wsfy(getAll.properties.data as fastJson.ObjectSchema)),
    get: fastJson(get),
    getWS: fastJson(wsfy(get.properties.data as fastJson.ObjectSchema)),
    getMemberships: fastJson(getMemberships),
    getMembershipsWS: fastJson(
        wsfy(getMemberships.properties.data as fastJson.ObjectSchema),
    ),
};
