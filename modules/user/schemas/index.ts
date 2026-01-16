import fastJson from 'fast-json-stringify';

import {wsfy} from '@utils/schemas';

import getUser from './getUser.schema';

export default {
    getUser: fastJson(getUser),
    getUserWS: fastJson(wsfy(getUser.properties.data as fastJson.ObjectSchema)),
};
