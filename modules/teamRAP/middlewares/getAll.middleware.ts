import {ObjectId} from 'mongodb';

// import {permissions} from '@constants/permissions';
// import userServices from '@modules/user/services';
import teamMemberRAPServices from '@modules/teamMember/services';
// import teamRAPServices from '@modules/teamRAP/services';

import type {Middleware} from '@customTypes';

const getAll = (): Middleware => {
    return async (_body, queryParams, iData) => {
        const {teamId} = queryParams;
        if (!teamId || !ObjectId.isValid(teamId)) {
            return {
                status: 400,
                message: 'INVALID_INPUT',
            };
        }

        const {userId} = iData;

        const isTeamMember = await teamMemberRAPServices.isMember(teamId, [
            userId,
        ]);

        // const hasPermission = await teamRAPServices.hasPermission({
        //     teamId,
        //     userId,
        //     permission: permissions.TEAM.MANAGE_ROLES,
        // });

        if (!isTeamMember) {
            return {
                status: 401,
                message: 'UNAUTHORIZED',
            };
        }

        return true;
    };
};

export default getAll;
