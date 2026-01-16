import {ObjectId} from 'mongodb';

import {ChannelMemberCollection} from '@collections';

import type {_ID, Channel, User} from '@customTypes';

async function updateLastViewedAt(
    channelId: _ID<Channel>,
    userId: _ID<User>,
    lastViewedAt = Date.now(),
): Promise<void> {
    await ChannelMemberCollection().updateOne(
        {
            channelId: new ObjectId(channelId),
            userId: new ObjectId(userId),
        },
        {
            $set: {
                lastViewedAt,
                updatedAt: Date.now(),
            },
        },
    );
}

export default updateLastViewedAt;
