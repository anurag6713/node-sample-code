import WSE from '@constants/websocketEvents';
import channelServices from '@modules/channel/services';
import channelUtils from '@modules/channel/utils';
import channelMemberServices from '@modules/channelMember/services';
import channelRAPServices from '@modules/channelRAP/services';
import teamSchemas from '@modules/team/schemas';
import teamServices from '@modules/team/services';
import teamInviteServices from '@modules/teamInvite/services';
import teamMemberServices from '@modules/teamMember/services';
import teamRAPServices from '@modules/teamRAP/services';
import utils from '@utils';
import wsUsers from '@websocket/users';

import type {
    ChannelMember,
    ChannelRAP,
    Controller,
    TeamMember,
    TeamMemberRAP,
} from '@customTypes';

const joinWithInvite: Controller = async (_body, queryParams, iData) => {
    try {
        const {_id} = queryParams;
        const {userId} = iData;

        const invite = await teamInviteServices.get(_id, {
            userId: 1,
            teamId: 1,
        });

        if (!invite || invite.userId.toString() !== userId.toString()) {
            return {message: 'INVALID_INPUT', status: 400};
        }

        const {teamId} = invite;
        const team = await teamServices.getBy('_id', teamId, {
            name: 1,
        });
        if (!team) {
            return {message: 'SOMETHING_WENT_WRONG', status: 400};
        }

        // 1. Add user to team
        team.membership = await teamMemberServices.addMember({
            teamId,
            userId,
        } as TeamMember);

        const defaultRole = await teamRAPServices.getDefaultRole(teamId);
        if (!defaultRole) {
            return {message: 'SOMETHING_WENT_WRONG', status: 400};
        }

        // 2. Assign default role to the user
        defaultRole.membership = await teamRAPServices.assign({
            teamId,
            userId,
            roleId: defaultRole._id,
        } as TeamMemberRAP);

        // 3 Add role to the team response
        team.roles = [defaultRole];

        // 4. Update members count
        team.membersCount = await teamMemberServices.updateMembersCount(teamId);

        // 5. Add user to the default channels
        team.channels = await channelServices.getDefaultChannels(teamId);
        for (let i = 0; i < team.channels.length; i++) {
            team.channels[i].membership = await channelMemberServices.addMember(
                {
                    channelId: team.channels[i]._id,
                    userId,
                } as ChannelMember,
            );
            // 5.1 Update membersCount
            team.channels[i].membersCount =
                await channelMemberServices.updateMembersCount(
                    team.channels[i]._id,
                );
            // 5.2 Get Channel RAP if exists
            team.channels[i].rap = await channelRAPServices.getByChannelId(
                defaultRole._id,
                team.channels[i]._id,
            );
            team.channels[i].rap = team.channels[i].rap || ({} as ChannelRAP);
            // 5.2 Add a default channel joined message
            await channelUtils.defaultChannelJoinedMessage(
                team.channels[i]._id,
                [userId],
            );
        }

        // 6. Delete the request
        await teamInviteServices.decline({_id, userId});

        wsUsers.sendMessage(
            userId,
            {
                type: WSE.TEAM_JOINED,
                data: team,
            },
            teamSchemas.getWS,
        );

        return {status: 200, data: team};
    } catch (e) {
        utils.log(e);
        return {message: 'SOMETHING_WENT_WRONG', status: 500};
    }
};

export default joinWithInvite;
