import WSE from '@constants/websocketEvents';
import channelSchemas from '@modules/channel/schemas';
import channelUtils from '@modules/channel/utils';
import channelMemberServices from '@modules/channelMember/services';
import utils from '@utils';
import wsUsers from '@websocket/users';

import type {_ID, Controller, Channel, ChannelMember, User} from '@customTypes';

export type Body = {
    channelId: _ID<Channel>;
    userIds: _ID<User>[];
};

const addMembers: Controller = async (body, _queryParams, iData) => {
    try {
        const {channelId, userIds} = body as Body;
        const {channel} = iData;

        const failedUserIds: _ID<User>[] = [];
        const addedUserIds: _ID<User>[] = [];

        const userMemberships: {[key: string]: ChannelMember} = {};
        for (let i = 0; i < userIds.length; i++) {
            const userId = userIds[i];
            try {
                // 1. Become a member of the channel
                const membership = await channelMemberServices.addMember({
                    channelId,
                    userId: userIds[i],
                } as ChannelMember);

                // 2. If it's successful, send a message to the user through WS
                if (membership) {
                    addedUserIds.push(userId);
                    userMemberships[userId.toString()] = membership;
                } else {
                    failedUserIds.push(userId);
                }
            } catch (e) {
                failedUserIds.push(userId);
            }
        }

        // 3. Update membersCount
        channel.membersCount = await channelMemberServices.updateMembersCount(
            channelId,
        );

        for (let i = 0; i < userIds.length; i++) {
            const userIdString = userIds[i].toString();
            const membership = userMemberships[userIdString];
            if (userMemberships[userIdString]) {
                wsUsers.sendMessage(
                    userIds[i],
                    {
                        type: WSE.CHANNEL_JOINED,
                        data: {
                            ...channel,
                            membership,
                        },
                    },
                    channelSchemas.getWS,
                );
            }
        }

        // 4. Send a message to the channel through WS
        setTimeout(async () => {
            await channelUtils.defaultChannelJoinedMessage(
                channelId,
                addedUserIds,
                iData.userId,
            );
        });

        return {
            data: {
                failedUserIds,
            },
        };
    } catch (e) {
        utils.log(e);
        return {message: 'SOMETHING_WENT_WRONG', status: 500};
    }
};

export default addMembers;
