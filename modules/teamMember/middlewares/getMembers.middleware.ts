import {ObjectId} from 'mongodb';

import channelServices from '@modules/channel/services';
import teamMemberServices from '@modules/teamMember/services';
import utils from '@utils';

import type {Middleware} from '@customTypes';
import type {Body} from '@modules/teamMember/controllers/getMembers.controller';

const getMembers = (): Middleware => {
    return async (body, _queryParams, iData) => {
        const {teamId, channelIds, excludeChannelIds, limit} = body as Body;

        // Check if passed data is valid
        const invalidTeamId = !teamId || !ObjectId.isValid(teamId);
        const invalidChannelIds = channelIds
            ? !utils.isValidObjectIds(channelIds)
            : false;
        const invalidExcludeChannelIds = excludeChannelIds
            ? !utils.isValidObjectIds(excludeChannelIds)
            : false;
        if (
            invalidTeamId ||
            invalidChannelIds ||
            invalidExcludeChannelIds ||
            limit > 100
        ) {
            return {
                status: 400,
                message: 'INVALID_INPUT',
            };
        }

        // Check if user belongs to the team
        if (!(await teamMemberServices.isMember(teamId, [iData.userId]))) {
            return {
                status: 400,
                message: 'NOT_A_MEMBER',
            };
        }

        // Check if all channels belong to the team
        const allChannels = [
            ...(channelIds || []),
            ...(excludeChannelIds || []),
        ];
        if (allChannels.length) {
            if (
                !(await channelServices.doesBelongToTeam(teamId, allChannels))
            ) {
                return {
                    status: 400,
                    message: 'INVALID_INPUT',
                };
            }
        }

        return true;
    };
};

export default getMembers;
