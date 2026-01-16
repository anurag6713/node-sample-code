import {ObjectId} from 'mongodb';

import {permissions as permissionsList} from '@constants/permissions';
import channelServices from '@modules/channel/services';
import teamRAPServices from '@modules/teamRAP/services';

import type {Middleware, ChannelRAP} from '@customTypes';

const editPermissions = (): Middleware => {
    return async (body, _queryParams, {userId}) => {
        const {channelId, roleId, permissions, excludedPermissions} =
            body as ChannelRAP;

        // 1. Check if input data is alright
        if (
            !channelId ||
            !ObjectId.isValid(channelId) ||
            !roleId ||
            !ObjectId.isValid(roleId) ||
            !permissions ||
            !Array.isArray(permissions) ||
            !excludedPermissions ||
            !Array.isArray(excludedPermissions)
        ) {
            return {
                status: 400,
                message: 'INVALID_INPUT',
            };
        }

        // 2. Get the teamId from the channelId
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

        // 3. Check if the user has the permission to edit the role
        const permission = await teamRAPServices.hasPermission({
            teamId,
            userId,
            permission: permissionsList.TEAM.MANAGE_ROLES,
        });

        if (!permission) {
            return {
                status: 401,
                message: 'NO_PERMISSION',
            };
        }

        // 4. Check if the user's role is higher than the role being edited
        const hasSuperiorRole = await teamRAPServices.hasSuperiorRole({
            roleId,
            teamId,
            userId,
        });
        if (!hasSuperiorRole) {
            return {
                status: 401,
                message: 'UNAUTHORIZED',
            };
        }

        return true;
    };
};

export default editPermissions;
