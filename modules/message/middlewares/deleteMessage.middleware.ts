import {ObjectId} from 'mongodb';

import {permissions} from '@constants/permissions';
import channelServices from '@modules/channel/services';
import channelMemberServices from '@modules/channelMember/services';
import messageServices from '@modules/message/services';
import teamRAPServices from '@modules/teamRAP/services';

import type {Middleware} from '@customTypes';

const newMessage = (): Middleware => {
    return async (_body, queryParams, iData) => {
        const {channelId, messageId} = queryParams;
        const {userId} = iData;

        // 1. Check if input is right
        if (
            !channelId ||
            !ObjectId.isValid(channelId) ||
            !messageId ||
            !ObjectId.isValid(messageId)
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

        // 3. Check if it's the owner of the message
        const message = await messageServices.getMessage({
            _id: messageId,
            channelId,
            projection: {userId: 1, channelId: 1},
        });

        if (!message) {
            return {
                status: 400,
                message: 'INVALID_INPUT',
            };
        }

        // 3.1 If user is not the owner, check if user has permission to manage the message
        if (message.userId.toString() !== userId.toString()) {
            // 4. Get the teamId from the channelId
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

            // 4.1 Check if the user has the permission to manage messages
            const permission = await teamRAPServices.hasPermission({
                teamId,
                channelId,
                userId,
                permission: permissions.CHANNEL.MANAGE_MESSAGES,
            });

            if (!permission) {
                return {
                    status: 401,
                    message: 'NO_PERMISSION',
                };
            }
        }

        return true;
    };
};

export default newMessage;
