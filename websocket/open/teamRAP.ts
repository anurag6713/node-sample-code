import WSE from '@constants/websocketEvents';
import teamRAPSchemas from '@modules/teamRAP/schemas';
import teamRAPServices from '@modules/teamRAP/services';
import utils from '@utils';
import wsUsers from '@websocket/users';

import type {WebSocket} from '@customTypes';

async function teamRAP(ws: WebSocket): Promise<void> {
    const {syncInfo, user} = ws;

    // Send User RAPs
    teamRAPServices
        .getUserRAPs({
            userId: user._id,
            ...(syncInfo.teamRAP ? {since: syncInfo.teamRAP} : {status: 'a'}),
        })
        .then((roles) => {
            if (!roles.length) {
                return;
            }
            wsUsers.sendMessage(
                user._id,
                {
                    type: WSE.TEAM_RAP_LIST,
                    data: roles,
                },
                teamRAPSchemas.getAllWS,
                ws,
            );
        })
        .catch((e) => {
            utils.log(e);
        });

    // Send User RAP merberships
    teamRAPServices
        .getMemberships({
            userId: user._id,
            ...(syncInfo.teamMemberRAP
                ? {since: syncInfo.teamMemberRAP}
                : {status: 'a'}),
        })
        .then((memberships) => {
            if (!memberships.length) {
                return;
            }
            wsUsers.sendMessage(
                user._id,
                {
                    type: WSE.TEAM_MEMBER_RAP_LIST,
                    data: memberships,
                },
                teamRAPSchemas.getMembershipsWS,
                ws,
            );
        })
        .catch((e) => {
            utils.log(e);
        });
}

export default teamRAP;
