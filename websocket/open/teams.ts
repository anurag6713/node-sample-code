import WSE from '@constants/websocketEvents';
import teamSchemas from '@modules/team/schemas';
import teamInviteSchemas from '@modules/teamInvite/schemas';
import teamInviteServices from '@modules/teamInvite/services';
import teamMemberSchemas from '@modules/teamMember/schemas';
import teamMemberServices from '@modules/teamMember/services';
import utils from '@utils';
import wsUsers from '@websocket/users';

import type {WebSocket} from '@customTypes';

async function teams(ws: WebSocket): Promise<void> {
    const {syncInfo, user} = ws;

    // Send team data to this websocket
    teamMemberServices
        .getTeams({
            projection: {
                name: 1,
                updatedAt: 1,
            },
            userId: user._id,
            ...(syncInfo.team ? {since: syncInfo.team} : {status: 'a'}),
        })
        .then((teams) => {
            if (syncInfo.team && !teams.length) {
                return;
            }
            wsUsers.sendMessage(
                user._id,
                {
                    type: WSE.TEAMS_LIST,
                    data: [{_id: 'dm'}, ...teams],
                },
                teamSchemas.getAllWS,
                ws,
            );
        })
        .catch((e) => {
            utils.log(e);
        });

    // Send team memberships list
    teamMemberServices
        .getMemberships({
            userId: user._id,
            ...(syncInfo.teamMember
                ? {since: syncInfo.teamMember}
                : {status: 'a'}),
        })
        .then((memberships) => {
            if (!memberships.length) {
                return;
            }
            wsUsers.sendMessage(
                user._id,
                {
                    type: WSE.TEAMS_MEMBERSHIPS,
                    data: memberships,
                },
                teamMemberSchemas.getMembershipsWS,
                ws,
            );
        })
        .catch((e) => {
            utils.log(e);
        });

    // Send team invites
    teamInviteServices
        .getAll({
            userId: user._id,
            ...(syncInfo.invite ? {since: syncInfo.invite} : {status: 'a'}),
        })
        .then((invites) => {
            if (!invites.length) {
                return;
            }
            wsUsers.sendMessage(
                user._id,
                {
                    type: WSE.TEAM_INVITES_RECEIVED,
                    data: invites,
                },
                teamInviteSchemas.getInvitesWS,
                ws,
            );
        })
        .catch((e) => {
            utils.log(e);
        });
}

export default teams;
