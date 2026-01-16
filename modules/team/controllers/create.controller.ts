import WSE from '@constants/websocketEvents';
import channelServices from '@modules/channel/services';
import channelUtils from '@modules/channel/utils';
import channelMemberServices from '@modules/channelMember/services';
import teamSchemas from '@modules/team/schemas';
import teamServices from '@modules/team/services';
import teamMemberServices from '@modules/teamMember/services';
import teamRAPServices from '@modules/teamRAP/services';
import utils from '@utils';
import wsUsers from '@websocket/users';

import type {
    ChannelMember,
    Controller,
    Team,
    TeamMember,
    TeamMemberRAP,
} from '@customTypes';

const create: Controller = async (body, _queryParams, iData) => {
    try {
        const {userId} = iData;
        const data = {
            ...body,
            createdBy: userId,
        } as Team;

        // 1. Add team to DB
        const team = await teamServices.create(data);

        if (team?._id) {
            // 2. Setup Roles & Permissions
            const roles = await teamRAPServices.setup({
                teamId: team._id,
                type: data.type,
                userId: iData.userId,
            });

            // 3. Become a member
            team.membership = await teamMemberServices.addMember({
                teamId: team._id,
                userId,
            } as TeamMember);

            // 4. Assign highest role (owner)
            const role = roles[0];
            role.membership = await teamRAPServices.assign({
                teamId: team._id,
                userId,
                roleId: role._id,
            } as TeamMemberRAP);

            // 4.1 Send the role to the client
            team.roles = [role];

            // 5. Add default channels
            team.channels = await channelServices.setup({
                teamId: team._id,
                type: data.type,
                userId,
            });

            // 6. Add user to the default channels
            for (let i = 0; i < team.channels.length; i++) {
                const channelId = team.channels[i]._id;
                team.channels[i].membership =
                    await channelMemberServices.addMember({
                        channelId: team.channels[i]._id,
                        userId,
                    } as ChannelMember);
                // 6.1 Update membersCount
                team.channels[i].membersCount =
                    await channelMemberServices.updateMembersCount(
                        team.channels[i]._id,
                    );

                // 6.2 Add a default channel created message
                await channelUtils.defaultChannelCreatedMessage(
                    channelId,
                    userId,
                );
            }

            // 7. Sync data across other connections
            wsUsers.sendMessage(
                userId,
                {
                    type: WSE.TEAM_JOINED,
                    data: team,
                },
                teamSchemas.getWS,
            );

            return {
                data: team,
            };
        }
        return {message: 'SOMETHING_WENT_WRONG', status: 400};
    } catch (e) {
        utils.log(e);
        return {message: 'SOMETHING_WENT_WRONG', status: 500};
    }
};

export default create;
