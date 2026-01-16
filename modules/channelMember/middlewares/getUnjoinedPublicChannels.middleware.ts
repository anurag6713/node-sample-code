import {ObjectId} from 'mongodb';

import type {Middleware, Channel} from '@customTypes';

const getUnjoinedPublicChannels = (): Middleware => {
    return async (_body, queryParams) => {
        const {teamId} = queryParams as Channel;
        if (!teamId || !ObjectId.isValid(teamId)) {
            return {
                status: 400,
                message: 'INVALID_INPUT',
            };
        }
        return true;
    };
};

export default getUnjoinedPublicChannels;
