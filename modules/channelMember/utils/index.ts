import channelUtils from '@modules/channel/utils';
import channelMemberServices from '@modules/channelMember/services';

import type {Channel, ChannelMember, User, _ID} from '@customTypes';

async function commonStepsChannelLeave(
    channelId: _ID<Channel>,
    removedUserIds: _ID<User>[],
    removedBy?: _ID<User>,
): Promise<{
    channelMembers: ChannelMember[];
}> {
    const channelMembers: ChannelMember[] = [];
    // 1. Remove the user from the channel
    for (let i = 0; i < removedUserIds.length; i++) {
        channelMembers.push(
            await channelMemberServices.removeMember(
                channelId,
                removedUserIds[i],
            ),
        );
    }

    // 2. Update the members count
    await channelMemberServices.updateMembersCount(channelId);

    // 3. Send a message to the channel about leaving
    await channelUtils.defaultChannelLeaveMessage(
        channelId,
        removedUserIds,
        removedBy,
    );

    return {channelMembers};
}

export default {
    commonStepsChannelLeave,
};
