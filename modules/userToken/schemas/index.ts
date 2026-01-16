import fastJson from 'fast-json-stringify';

import get from './get.schema';

export default {
    get: fastJson(get),
};
