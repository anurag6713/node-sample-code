import {permissions as permissionsList} from '@constants/permissions';
import teamRAPServices from '@modules/teamRAP/services';
import teamRAPUtils from '@modules/teamRAP/utils';

import type {Middleware, TeamRAP} from '@customTypes';

const create = (): Middleware => {
    return async (body, _queryParams, iData) => {
        const {name, teamId, permissions = []} = body as TeamRAP;
        if (!name || name.length > 24) {
            return {
                status: 400,
                message: 'INVALID_INPUT',
            };
        }

        if (!permissions?.length) {
            return {status: 400, message: 'INVALID_INPUT'};
        }

        const {userId} = iData;

        const userPermissions = await teamRAPServices.getUserPermissions(
            userId,
            teamId,
        );
        if (
            !teamRAPUtils.hasAllPermissions(
                userPermissions,
                new Set(permissions),
            )
        ) {
            return {
                status: 401,
                message: 'UNAUTHORIZED',
            };
        }

        const hasPermission = await teamRAPServices.hasPermission({
            teamId,
            userId,
            permission: permissionsList.TEAM.MANAGE_ROLES,
        });

        if (!hasPermission) {
            return {
                status: 401,
                message: 'UNAUTHORIZED',
            };
        }

        return true;
    };
};

export default create;
