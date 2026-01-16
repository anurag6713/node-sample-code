import fastJson from 'fast-json-stringify';

import {wsfy} from '@utils/schemas';

import getMessages from './getMessages.schema';
import message from './message.schema';
import newMessage from './newMessage.schema';

export default {
    getMessages: fastJson(getMessages),
    message: fastJson(message),
    messageWS: fastJson(wsfy(message.properties.data as fastJson.ObjectSchema)),
    newMessage: fastJson(newMessage),
    newMessageWS: fastJson(
        wsfy(newMessage.properties.data as fastJson.ObjectSchema),
    ),
};
