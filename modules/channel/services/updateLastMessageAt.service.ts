import {ObjectId} from 'mongodb';

import {ChannelCollection} from '@collections';

import type {_ID, Channel} from '@customTypes';

async function updateLastMessageAt(
    _id: _ID<Channel>,
    lastMessageAt: number,
): Promise<void> {
    await ChannelCollection().updateOne(
        {
            _id: new ObjectId(_id),
        },
        {
            $set: {
                lastMessageAt,
                updatedAt: Date.now(),
            },
        },
    );
}

export default updateLastMessageAt;
