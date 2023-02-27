import fastJson from 'fast-json-stringify';

import getMessages from './getMessages.schema';

export default {
    getMessages: fastJson(getMessages),
};
