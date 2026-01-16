import {ObjectId} from 'mongodb';

import {permissions} from '@constants/permissions';
import channelServices from '@modules/channel/services';
import teamRAPServices from '@modules/teamRAP/services';

import type {Middleware} from '@customTypes';

const getAll = (): Middleware => {
    return async (_body, queryParams, {userId}) => {
        try {
            const {channelId} = queryParams;

            // 1. Check if input data is alright
            if (!channelId || !ObjectId.isValid(channelId)) {
                return {
                    status: 400,
                    message: 'INVALID_INPUT',
                };
            }

            // 2. Get TeamId from channel
            const channelData = await channelServices.getBy('_id', channelId, {
                teamId: 1,
            });

            const {teamId} = channelData;

            // 3. Check if user has permission to manage roles
            const permission = await teamRAPServices.hasPermission({
                teamId,
                userId,
                permission: permissions.TEAM.MANAGE_ROLES,
            });

            if (!permission) {
                return {
                    status: 401,
                    message: 'NO_PERMISSION',
                };
            }

            return true;
        } catch (e) {
            return {
                status: 400,
                message: 'SOMETHING_WENT_WRONG',
            };
        }
    };
};

export default getAll;
