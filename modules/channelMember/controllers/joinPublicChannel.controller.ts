import WSE from '@constants/websocketEvents';
import channelSchemas from '@modules/channel/schemas';
import channelUtils from '@modules/channel/utils';
import channelMemberServices from '@modules/channelMember/services';
import utils from '@utils';
import wsUsers from '@websocket/users';

import type {Controller, ChannelMember} from '@customTypes';

const joinPublicChannel: Controller = async (_body, queryParams, iData) => {
    try {
        const {channelId} = queryParams;
        const {channel, userId} = iData;

        // 1. Become a member of the channel
        channel.membership = await channelMemberServices.addMember({
            channelId,
            userId,
        } as ChannelMember);

        // 2. Update membersCount
        channel.membersCount = await channelMemberServices.updateMembersCount(
            channelId,
        );

        // 3. Sync data across other connections
        wsUsers.sendMessage(
            userId,
            {
                type: WSE.CHANNEL_JOINED,
                data: channel,
            },
            channelSchemas.getWS,
        );

        // 4. Send a message to the channel through WS
        setTimeout(async () => {
            await channelUtils.defaultChannelJoinedMessage(channelId, [userId]);
        });

        return {
            data: channel,
        };
    } catch (e) {
        utils.log(e);
        return {message: 'SOMETHING_WENT_WRONG', status: 500};
    }
};

export default joinPublicChannel;
