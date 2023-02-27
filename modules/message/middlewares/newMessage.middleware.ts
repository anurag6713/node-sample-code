import {ObjectId} from 'mongodb';

import {permissions} from '@constants/permissions';
import channelServices from '@modules/channel/services';
import channelMemberServices from '@modules/channelMember/services';
import teamRAPServices from '@modules/teamRAP/services';

import type {Message, Middleware} from '@customTypes';

const newMessage = (): Middleware => {
    return async (body, _queryParams, iData) => {
        const {channelId, text} = body as Message;
        const {userId} = iData;

        // 1. Check the input
        if (
            !text ||
            !text.trim() ||
            !channelId ||
            !ObjectId.isValid(channelId)
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

        // 3. Get teamId
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

        // 4 Check if the user has the permission to manage messages
        const permission = await teamRAPServices.hasPermission({
            teamId,
            channelId,
            userId,
            permission: permissions.MESSAGE.SEND,
        });

        if (!permission) {
            return {
                status: 401,
                message: 'NO_PERMISSION',
            };
        }

        return true;
    };
};

export default newMessage;
