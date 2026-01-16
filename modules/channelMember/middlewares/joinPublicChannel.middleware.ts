import {ObjectId} from 'mongodb';

import channelServices from '@modules/channel/services';
import teamMemberServices from '@modules/teamMember/services';

import type {Middleware} from '@customTypes';

const joinPublicChannel = (): Middleware => {
    return async (_body, {channelId}, iData) => {
        if (!channelId || !ObjectId.isValid(channelId)) {
            return {
                status: 400,
                message: 'INVALID_INPUT',
            };
        }

        // Get the complete channel to send to the client later
        const channelData = await channelServices.getBy('_id', channelId);
        if (
            !channelData ||
            !channelData.teamId ||
            channelData.isPrivate ||
            channelData.type !== 'c'
        ) {
            return {
                status: 404,
                message: 'NOT_FOUND',
            };
        }
        const isUserInTeam = await teamMemberServices.isMember(
            channelData.teamId,
            [iData.userId],
        );
        if (!isUserInTeam) {
            return {
                status: 401,
                message: 'UNAUTHORIZED',
            };
        }

        // forward the channel data
        iData.channel = channelData;
        return true;
    };
};

export default joinPublicChannel;
