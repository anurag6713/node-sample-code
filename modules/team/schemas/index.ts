import fastJson from 'fast-json-stringify';

import {wsfy} from '@utils/schemas';

import get from './get.schema';
import getAll from './getAll.schema';

export default {
    get: fastJson(get),
    getWS: fastJson(wsfy(get.properties.data as fastJson.ObjectSchema)),
    getAll: fastJson(getAll),
    getAllWS: fastJson(wsfy(getAll.properties.data as fastJson.ObjectSchema)),
};
