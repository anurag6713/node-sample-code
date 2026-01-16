import {ObjectId} from 'mongodb';

import {ChannelMemberCollection} from '@collections';

import type {_ID, Channel, User} from '@customTypes';

async function isMember(
    channelId: _ID<Channel>,
    userIds: _ID<User>[],
): Promise<boolean> {
    const result = await ChannelMemberCollection()
        .find(
            {
                channelId: new ObjectId(channelId),
                userId: {
                    $in: userIds.map((userId) => new ObjectId(userId)),
                },
                status: 'a',
            },
            {
                projection: {
                    _id: 1,
                },
            },
        )
        .toArray();
    if (result.length === userIds.length) {
        return true;
    }
    return false;
}

export default isMember;
