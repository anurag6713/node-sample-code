import {Filter, ObjectId} from 'mongodb';

import {ChannelMemberCollection} from '@collections';

import type {_ID, ChannelMember, User} from '@customTypes';

async function getMemberships({
    since,
    status,
    userId,
}: {
    since?: number;
    status?: ChannelMember['status'];
    userId: _ID<User>;
}): Promise<ChannelMember[]> {
    const query: Filter<ChannelMember> = {
        userId: new ObjectId(userId),
    };
    if (since) {
        query.updatedAt = {
            $gt: since,
        };
    } else {
        query.status = status || 'a';
    }
    const result = await ChannelMemberCollection().find(query).toArray();
    return result;
}

export default getMemberships;
