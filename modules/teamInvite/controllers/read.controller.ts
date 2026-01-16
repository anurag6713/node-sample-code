import WSE from '@constants/websocketEvents';
import teamInviteServices from '@modules/teamInvite/services';
import utils from '@utils';
import wsUsers from '@websocket/users';

import type {Controller} from '@customTypes';

const invitesRead: Controller = async (_body, _queryParams, iData) => {
    try {
        const {userId} = iData;
        await teamInviteServices.read(userId);
        wsUsers.sendMessage(userId, {
            type: WSE.TEAM_INVITES_READ,
            data: null,
        });
        return {status: 200};
    } catch (e) {
        utils.log(e);
        return {message: 'SOMETHING_WENT_WRONG', status: 500};
    }
};

export default invitesRead;
