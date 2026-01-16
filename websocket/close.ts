import userServices from '@modules/user/services';
import userTokenServices from '@modules/userToken/services';
import utils from '@utils';

import users from './users';

import type {WebSocket} from '@customTypes';

async function close(
    ws: WebSocket,
    // code: number,
    // message: ArrayBuffer,
): Promise<void> {
    try {
        const {tokenId, user} = ws;

        if (!user?._id) {
            return;
        }

        setTimeout(async () => {
            await userTokenServices.update(tokenId, {
                isActive: false,
                lastDisconnectedAt: Date.now(),
            });
            const hasActiveToken = await userTokenServices.hasActiveToken(
                user._id,
            );
            if (!hasActiveToken) {
                await userServices.update(user._id, {
                    isOnline: false,
                });
            }
        });

        users.remove(user._id.toString(), ws);
    } catch (e) {
        utils.log('websocket -> close', e);
    }
}

export default close;
