import WSE from '@constants/websocketEvents';
import teamMemberServices from '@modules/teamMember/services';
import teamRAPSchemas from '@modules/teamRAP/schemas';
import teamRAPServices from '@modules/teamRAP/services';
import utils from '@utils';
import wsUsers from '@websocket/users';

import type {Controller, TeamRAP} from '@customTypes';

const edit: Controller = async (body) => {
    try {
        const {_id, permissions} = body as TeamRAP;

        // Step 1: Update permissions
        const data = await teamRAPServices.edit({
            _id,
            permissions,
        } as TeamRAP);

        // Step 2: Get all the users with this role
        const onlineRoleMembers = await teamMemberServices.getMembers({
            roleIds: [_id],
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
                type: WSE.TEAM_RAP_UPDATED,
                data,
            },
            teamRAPSchemas.getWS,
        );

        return {};
    } catch (e) {
        utils.log(e);
        return {message: 'SOMETHING_WENT_WRONG', status: 500};
    }
};

export default edit;
