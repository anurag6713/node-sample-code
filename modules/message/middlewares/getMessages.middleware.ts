import {ObjectId} from 'mongodb';
import {MAX_MESSAGES_FETCH_LIMIT} from '@config';

import channelMemberServices from '@modules/channelMember/services';
import utils from '@utils';

import type {Middleware} from '@customTypes';

const getMessages = (): Middleware => {
    return async (_body, queryParams, iData) => {
        const {channelId, lastMessageId, limit} = queryParams;
        const {userId} = iData;

        // 1. Check the input
        if (
            !channelId || !ObjectId.isValid(channelId) ||
            (lastMessageId && !ObjectId.isValid(lastMessageId)) ||
            !utils.isNumber(limit) ||
            Number(limit) > MAX_MESSAGES_FETCH_LIMIT
        ) {
            return {
                status: 400,
                message: 'INVALID_INPUT',
            };
        }

        // 2. Check if user is member of the channel
        const isMember = await channelMemberServices.isMember(channelId, [
            userId,
        ]);

        if (!isMember) {
            return {
                status: 401,
                message: 'UNAUTHORIZED',
            };
        }

        return true;
    };
};

export default getMessages;
