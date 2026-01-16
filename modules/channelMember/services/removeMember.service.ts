import {ObjectId} from 'mongodb';

import {ChannelMemberCollection, UserCollection} from '@collections';

import type {_ID, Channel, User, ChannelMember} from '@customTypes';

async function removeMember(
    channelId: _ID<Channel>,
    userId: _ID<User>,
): Promise<ChannelMember> {
    channelId = new ObjectId(channelId);
    userId = new ObjectId(userId);
    const result = await ChannelMemberCollection().findOneAndUpdate(
        {
            channelId,
            userId,
        },
        {
            $set: {
                status: 'd',
                updatedAt: Date.now(),
            },
        },
        {
            returnDocument: 'after',
        },
    );

    // Remove team from user collection as well
    await UserCollection().updateOne(
        {
            _id: userId,
        },
        {
            $pull: {
                channelIds: channelId,
            },
        },
    );

    return result.value;
}

export default removeMember;
