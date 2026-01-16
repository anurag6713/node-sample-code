import WSE from '@constants/websocketEvents';
import channelMemberSchemas from '@modules/channelMember/schemas';
import channelMemberUtils from '@modules/channelMember/utils';
import utils from '@utils';
import wsUsers from '@websocket/users';

import type {Controller} from '@customTypes';

const leaveChannel: Controller = async (_body, queryParams, iData) => {
    try {
        const {channelId} = queryParams;
        const {userId} = iData;

        // 1. Perform common steps while leaving the channel
        const {channelMembers} =
            await channelMemberUtils.commonStepsChannelLeave(channelId, [
                userId,
            ]);

        // 2. Let user know that they have left the channel
        wsUsers.sendMessage(
            userId,
            {
                type: WSE.CHANNEL_LEFT,
                data: channelMembers,
            },
            channelMemberSchemas.getMembershipsWS,
        );

        return {};
    } catch (e) {
        utils.log(e);
        return {message: 'SOMETHING_WENT_WRONG', status: 500};
    }
};

export default leaveChannel;
