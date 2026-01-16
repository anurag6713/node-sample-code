import WSE from '@constants/websocketEvents';
import teamInviteServices from '@modules/teamInvite/services';
import utils from '@utils';
import wsUsers from '@websocket/users';

import type {Controller} from '@customTypes';

const invitesRead: Controller = async (_body, queryParams, iData) => {
    try {
        const {_id} = queryParams;
        const {userId} = iData;
        await teamInviteServices.decline({
            _id,
            userId,
        });
        wsUsers.sendMessage(userId, {
            type: WSE.TEAM_INVITE_DECLINED,
            data: _id,
        });
        return {status: 200};
    } catch (e) {
        utils.log(e);
        return {message: 'SOMETHING_WENT_WRONG', status: 500};
    }
};

export default invitesRead;
