import WSE from '@constants/websocketEvents';
import channelMemberServices from '@modules/channelMember/services';
import channelMemberUtils from '@modules/channelMember/utils';
import teamMemberSchemas from '@modules/teamMember/schemas';
import teamMemberServices from '@modules/teamMember/services';
import teamRAPServices from '@modules/teamRAP/services';
import utils from '@utils';
import wsUsers from '@websocket/users';

import type {Controller} from '@customTypes';

const leaveTeam: Controller = async (_body, queryParams, iData) => {
    try {
        const {teamId} = queryParams;
        const {userId} = iData;

        // 1. Get all the channels user is part of
        const channels = await channelMemberServices.getChannels({
            userId: iData.userId,
            teamId,
            status: 'a',
            projection: {
                _id: 1,
            },
        });

        // 2. Remove user from all the channels
        for await (const channel of channels) {
            await channelMemberUtils.commonStepsChannelLeave(channel._id, [
                iData.userId,
            ]);
        }

        // 3. Remove the user from team RAPs
        const teamRAPS = await teamRAPServices.getUserRAPs({
            teamId,
            userId,
            status: 'a',
            projection: {
                _id: 1,
            },
        });

        for await (const teamRAP of teamRAPS) {
            await teamRAPServices.remove(teamRAP._id, userId);
        }

        // 4. Remove the user from the team
        const teamMember = await teamMemberServices.removeMember(
            teamId,
            userId,
        );

        // 5. Update the members count
        await teamMemberServices.updateMembersCount(teamId);

        // 6. Let user know that they have left the team
        wsUsers.sendMessage(
            userId,
            {
                type: WSE.TEAM_LEFT,
                data: [teamMember],
            },
            teamMemberSchemas.getMembershipsWS,
        );

        return {};
    } catch (e) {
        utils.log(e);
        return {message: 'SOMETHING_WENT_WRONG', status: 500};
    }
};

export default leaveTeam;
