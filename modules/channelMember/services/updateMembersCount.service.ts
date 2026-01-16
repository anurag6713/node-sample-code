import {ObjectId} from 'mongodb';

import {ChannelCollection, ChannelMemberCollection} from '@collections';

import type {_ID, Channel} from '@customTypes';
import type {MatchKeysAndValues} from 'mongodb';

async function updateMembersCount(_id: _ID<Channel>): Promise<number> {
    const membersCount = await ChannelMemberCollection().countDocuments({
        channelId: new ObjectId(_id),
        status: 'a',
    });
    const $set: MatchKeysAndValues<Channel>['$set'] = {
        membersCount,
        updatedAt: Date.now(),
    };
    await ChannelCollection().updateOne(
        {
            _id: new ObjectId(_id),
        },
        {
            $set,
        },
    );
    return membersCount;
}

export default updateMembersCount;
