import {ObjectId} from 'mongodb';

import channelServices from '@modules/channel/services';
import channelMemberServices from '@modules/channelMember/services';

import type {Middleware} from '@customTypes';

const isMember = (): Middleware => {
    return async (_body, {channelId}, iData) => {
        if (!channelId || !ObjectId.isValid(channelId)) {
            return {
                status: 400,
                message: 'INVALID_INPUT',
            };
        }

        const channelData = await channelServices.getBy('_id', channelId, {
            _id: 1,
        });
        if (!channelData || !channelData._id) {
            return {
                status: 404,
                message: 'NOT_FOUND',
            };
        }
        const isUserInChannel = await channelMemberServices.isMember(
            channelId,
            [iData.userId],
        );
        if (!isUserInChannel) {
            return {
                status: 401,
                message: 'UNAUTHORIZED',
            };
        }

        return true;
    };
};

export default isMember;
