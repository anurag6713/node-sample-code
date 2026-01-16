import teamMemberServices from '@modules/teamMember/services';
import utils from '@utils';

import type {_ID, Channel, Controller, Team} from '@customTypes';

export type Body = {
    teamId: _ID<Team>;
    channelIds: _ID<Channel>[];
    excludeChannelIds: _ID<Channel>[];
    getTeamRoleIds?: boolean;
    q: string;
    skip: number;
    limit: number;
};

const getMembers: Controller = async (body) => {
    try {
        const {
            teamId,
            channelIds,
            excludeChannelIds,
            getTeamRoleIds,
            q,
            skip,
            limit,
        } = body as Body;
        const members = await teamMemberServices.getMembers({
            teamIds: [teamId],
            channelIds,
            excludeChannelIds,
            getTeamRoleIds,
            q,
            skip,
            limit,
            projection: {
                firstName: 1,
                lastName: 1,
                ...(getTeamRoleIds ? {roleIds: 1} : {}),
            },
        });
        return {
            data: members,
        };
    } catch (e) {
        utils.log(e);
        return {message: 'SOMETHING_WENT_WRONG', status: 500};
    }
};

export default getMembers;
