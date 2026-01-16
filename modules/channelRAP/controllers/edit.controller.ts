import WSE from '@constants/websocketEvents';
import channelRAPSchemas from '@modules/channelRAP/schemas';
import channelRAPServices from '@modules/channelRAP/services';
import teamMemberServices from '@modules/teamMember/services';
import utils from '@utils';
import wsUsers from '@websocket/users';

import type {ChannelRAP, Controller} from '@customTypes';

const edit: Controller = async (body) => {
    try {
        const {channelId, roleId, permissions, excludedPermissions} =
            body as ChannelRAP;

        // Step 1: Update permissions
        const data = await channelRAPServices.edit({
            channelId,
            roleId,
            permissions,
            excludedPermissions,
        } as ChannelRAP);

        // Step 2: Get all the channel users with this role
        const onlineRoleMembers = await teamMemberServices.getMembers({
            channelIds: [channelId],
            roleIds: [roleId],
            getAll: true,
            onlineOnly: true,
            projection: {
                _id: 1,
            },
        });

        const userIds = onlineRoleMembers.map((user) => user._id);

        // Step 3: Send updated permissions to all users with the role
        wsUsers.sendMessage(
            userIds,
            {
                type: WSE.CHANNEL_RAP_UPDATED,
                data,
            },
            channelRAPSchemas.getWS,
        );

        return {};
    } catch (e) {
        utils.log(e);
        return {message: 'SOMETHING_WENT_WRONG', status: 500};
    }
};

export default edit;
