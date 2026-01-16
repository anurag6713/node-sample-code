import {ObjectId} from 'mongodb';

import teamServices from '@modules/team/services';
import teamMemberServices from '@modules/teamMember/services';

import type {Middleware} from '@customTypes';

const isMember = (): Middleware => {
    return async (_body, {teamId}, iData) => {
        if (!teamId || !ObjectId.isValid(teamId)) {
            return {
                status: 400,
                message: 'INVALID_INPUT',
            };
        }

        const teamData = await teamServices.getBy('_id', teamId, {
            _id: 1,
        });
        if (!teamData || !teamData._id) {
            return {
                status: 404,
                message: 'NOT_FOUND',
            };
        }
        const isUserInTeam = await teamMemberServices.isMember(teamId, [
            iData.userId,
        ]);
        if (!isUserInTeam) {
            return {
                status: 401,
                message: 'UNAUTHORIZED',
            };
        }

        return true;
    };
};

export default isMember;
