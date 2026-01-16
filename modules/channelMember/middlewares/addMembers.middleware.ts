import {ObjectId} from 'mongodb';

import channelServices from '@modules/channel/services';
import teamMemberServices from '@modules/teamMember/services';
import utils from '@utils';

import type {Middleware} from '@customTypes';
import type {Body} from '@modules/channelMember/controllers/addMembers.controller';

const getUnjoinedPublicChannels = (): Middleware => {
    return async (body, _queryParams, iData) => {
        const {userIds, channelId} = body as Body;

        if (
            !channelId ||
            !ObjectId.isValid(channelId) ||
            !userIds ||
            !Array.isArray(userIds) ||
            !utils.isValidObjectIds(userIds)
        ) {
            return {
                status: 400,
                message: 'INVALID_INPUT',
            };
        }
        const channel = await channelServices.getBy('_id', channelId);
        if (!channel) {
            return {
                status: 404,
                message: 'CHANNEL_NOT_FOUND',
            };
        }
        if (!teamMemberServices.isMember(channel.teamId, userIds)) {
            return {
                status: 400,
                message: 'NOT_A_MEMBER',
            };
        }

        // Use it in the controller
        iData.channel = channel;

        return true;
    };
};

export default getUnjoinedPublicChannels;
