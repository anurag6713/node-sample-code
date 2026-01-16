import {permissions} from '@constants/permissions';
import teamRAPServices from '@modules/teamRAP/services';

import type {Middleware, TeamRAP} from '@customTypes';

const remove = (): Middleware => {
    return async (body, _queryParams, iData) => {
        const {name, teamId} = body as TeamRAP;
        if (!name || name.length > 24) {
            return {
                status: 400,
                message: 'INVALID_INPUT',
            };
        }

        const {userId} = iData;

        const hasPermission = await teamRAPServices.hasPermission({
            teamId,
            userId,
            permission: permissions.TEAM.MANAGE_ROLES,
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

export default remove;
