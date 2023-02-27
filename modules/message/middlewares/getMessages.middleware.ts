import {ObjectId} from 'mongodb';

import {MAX_MESSAGES_FETCH_LIMIT} from '@config';
import {permissions} from '@constants/permissions';
import channelServices from '@modules/channel/services';
import channelMemberServices from '@modules/channelMember/services';
import teamRAPServices from '@modules/teamRAPServices/services';
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

        // 3. Get the teamId from the channelId
        const channelData = await channelServices.getBy('_id', channelId, {
            teamId: 1,
        });
        if (!channelData) {
            return {
                status: 400,
                message: 'INVALID_INPUT',
            };
        }

        const {teamId} = channelData;

        // 4. Check if user has permission to view messages
        const hasFetchPermission = await teamRAPServices.hasPermission(
            teamId,
            channelId,
            userId,
            permission: permissions.MESSAGES.VIEW,
        );

        if (!hasFetchPermission) {
            return {
                status: 401,
                message: 'NO_PERMISSION',
            };
        }

        return true;
    };
};

export default getMessages;
