import jwt from 'jsonwebtoken';
import {ObjectId} from 'mongodb';
import uWebSockets from 'uWebSockets.js';

import qs from 'querystring';

import config from '@config';
import userServices from '@modules/user/services';
import userTokenServices from '@modules/userToken/services';
import utils from '@utils';

import type {JWTData, User} from '@customTypes';

async function upgrade(
    res: uWebSockets.HttpResponse,
    req: uWebSockets.HttpRequest,
    context: uWebSockets.us_socket_context_t,
): Promise<void | uWebSockets.HttpResponse> {
    try {
        const upgradeAborted = {aborted: false};

        res.onAborted(() => {
            upgradeAborted.aborted = true;
        });

        const url = req.getUrl();
        const secWebSocketKey = req.getHeader('sec-websocket-key');
        const secWebSocketProtocol = req.getHeader('sec-websocket-protocol');
        const secWebSocketExtensions = req.getHeader(
            'sec-websocket-extensions',
        );

        const query = qs.parse(req.getQuery());
        const token = query.token as string;

        let user: null | User;
        let tokenId: null | ObjectId;
        if (token) {
            try {
                const verifiedObj = jwt.verify(
                    token,
                    config.SECRET_KEY,
                ) as JWTData;
                if (
                    verifiedObj &&
                    typeof verifiedObj === 'object' &&
                    verifiedObj._id &&
                    verifiedObj.userId
                ) {
                    tokenId = verifiedObj._id;
                    user = await userServices.getByTokenId(verifiedObj._id, {
                        firstName: 1,
                        lastName: 1,
                        email: 1,
                        dob: 1,
                        gender: 1,
                        image: 1,
                        preferences: 1,
                    });
                    setTimeout(async () => {
                        if (!user) {
                            return;
                        }
                        const userUpdate = userServices.update(user._id, {
                            isOnline: true,
                        });
                        const userTokenUpdate = userTokenServices.update(
                            verifiedObj._id,
                            {
                                isActive: true,
                                lastConnectedAt: Date.now(),
                            },
                        );
                        await Promise.all([userUpdate, userTokenUpdate]);
                    });
                }
            } catch (e) {
                utils.log(e);
            }
        }

        // @todo - Do not upgrade if no user
        //         Mobile client is able to receive res.writeStatus(401) but web client is not able to receive it.
        res.upgrade(
            {
                connectionId: utils.generateToken(16),
                url,
                user,
                tokenId,
                syncInfo: {
                    channel: query.channel ? Number(query.channel) : 0,
                    channelRAP: query.channelRAP ? Number(query.channelRAP) : 0,
                    channelMember: query.channelMember
                        ? Number(query.channelMember)
                        : 0,
                    team: query.team ? Number(query.team) : 0,
                    teamMember: query.teamMember ? Number(query.teamMember) : 0,
                    teamMemberRAP: query.teamMemberRAP
                        ? Number(query.teamMemberRAP)
                        : 0,
                    teamRAP: query.teamRAP ? Number(query.teamRAP) : 0,
                    invite: query.invite ? Number(query.invite) : 0,
                },
            },
            secWebSocketKey,
            secWebSocketProtocol,
            secWebSocketExtensions,
            context,
        );
    } catch (e) {
        utils.log('websocket -> upgrade', e);
    }
}

export default upgrade;
