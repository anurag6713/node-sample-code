import WSE from '@constants/websocketEvents';
import teamServices from '@modules/team/services';
import teamInviteSchemas from '@modules/teamInvite/schemas';
import teamInviteServices from '@modules/teamInvite/services';
import utils from '@utils';
import wsUsers from '@websocket/users';

import type {Controller} from '@customTypes';

const invite: Controller = async (body, _queryParams, iData) => {
    try {
        const {teamId, emails} = body;
        const result = await teamInviteServices.invite({
            teamId,
            emails: sanitiseEmails(emails),
            createdBy: iData.userId,
        });
        if (result.length) {
            const team = await teamServices.getBy('_id', teamId, {
                name: 1,
            });
            result.forEach(({inviteId, userId}) => {
                wsUsers.sendMessage(
                    userId,
                    {
                        type: WSE.TEAM_INVITE_RECEIVED,
                        data: {
                            _id: inviteId,
                            isRead: false,
                            status: 'a',
                            teamId: team._id,
                            team,
                            createdAt: Date.now(),
                            updatedAt: Date.now(),
                        },
                    },
                    teamInviteSchemas.getInviteWS,
                );
            });
        }
        return {status: 200};
    } catch (e) {
        utils.log(e);
        return {message: 'SOMETHING_WENT_WRONG', status: 500};
    }
};

function sanitiseEmails(emails: string[]): string[] {
    const bank = {};
    const unique = [];
    for (let i = 0; i < emails.length; i++) {
        const email = emails[i].trim();
        if (!bank[email]) {
            bank[email] = true;
            unique.push(email);
        }
    }
    return unique;
}

export default invite;
