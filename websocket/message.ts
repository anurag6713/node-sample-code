import WSE from '@constants/websocketEvents';
import channelMemberServices from '@modules/channelMember/services';
import utils from '@utils';

import wsUsers from './users';

import type {WebSocket} from '@customTypes';

async function message(ws: WebSocket, message: ArrayBuffer): Promise<void> {
    try {
        const buffer = Buffer.from(message);
        const string = buffer.toString();
        const {type, data} = JSON.parse(string);

        switch (type) {
            case WSE.CHANNEL_VIEWED: {
                const {channelId, lastViewedAt} = data;
                const userId = ws.user._id;
                await channelMemberServices.updateLastViewedAt(
                    channelId,
                    ws.user._id,
                    lastViewedAt,
                );
                const response = await channelMemberServices.getUnreadsCount({
                    channelId,
                    userId,
                });
                const unreads = response[channelId] || 0;
                wsUsers.sendMessage(ws.user._id, {
                    type: WSE.CHANNEL_UNREADS,
                    data: {
                        channelId,
                        unreads,
                    },
                });
                break;
            }
            default:
                console.log(data);
        }
    } catch (e) {
        utils.log(e);
    }
}

export default message;
