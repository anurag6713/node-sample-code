import WSE from '@constants/websocketEvents';
import channelSchemas from '@modules/channel/schemas';
import channelServices from '@modules/channel/services';
import channelUtils from '@modules/channel/utils';
import channelMemberServices from '@modules/channelMember/services';
import utils from '@utils';
import wsUsers from '@websocket/users';

import type {Controller, Channel, ChannelMember} from '@customTypes';

const create: Controller = async (body, _queryParams, iData) => {
    try {
        const {userId} = iData;
        const createdAt = Date.now();
        const data = {
            ...body,
            createdAt,
            updatedAt: createdAt,
            createdBy: userId,
        } as Channel;

        // 1. Add channel to DB
        const channel = await channelServices.create(data);

        if (channel) {
            // 2. Become a member of channel
            channel.membership = await channelMemberServices.addMember({
                channelId: channel._id,
                userId,
            } as ChannelMember);

            // 3. Update membersCount
            channel.membersCount =
                await channelMemberServices.updateMembersCount(channel._id);

            // 6.2 Add a default channel created message
            await channelUtils.defaultChannelCreatedMessage(
                channel._id,
                userId,
            );

            // 5. Sync data across other connections
            wsUsers.sendMessage(
                userId,
                {
                    type: WSE.CHANNEL_JOINED,
                    data: channel,
                },
                channelSchemas.getWS,
            );
            return {
                data: channel,
            };
        }
        return {message: 'SOMETHING_WENT_WRONG', status: 400};
    } catch (e) {
        utils.log(e);
        return {message: 'SOMETHING_WENT_WRONG', status: 500};
    }
};

export default create;
