import WSE from '@constants/websocketEvents';
import userSchemas from '@modules/user/schemas';
import utils from '@utils';
import wsUsers from '@websocket/users';

import users from '../users';

import channels from './channels';
import teamRAP from './teamRAP';
import teams from './teams';

import type {WebSocket} from '@customTypes';

async function open(ws: WebSocket): Promise<void> {
    try {
        const {user} = ws;

        if (user) {
            // Add user to the list
            users.add(user._id.toString(), ws);

            // Send latest user data to this websocket
            wsUsers.sendMessage(
                user._id,
                {
                    type: WSE.MY_DATA,
                    data: user,
                },
                userSchemas.getUserWS,
                ws,
            );

            channels(ws);
            teamRAP(ws);
            teams(ws);
        } else {
            ws.send(JSON.stringify({type: WSE.UNAUTHORIZED}));
            ws.end(401);
        }
    } catch (e) {
        utils.log('websocket -> open', e);
    }
}

export default open;
