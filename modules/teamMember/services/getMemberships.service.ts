import {Filter, ObjectId} from 'mongodb';

import {TeamMemberCollection} from '@collections';

import type {_ID, TeamMember, User} from '@customTypes';

async function getMemberships({
    since,
    status,
    userId,
}: {
    since?: number;
    status?: TeamMember['status'];
    userId: _ID<User>;
}): Promise<TeamMember[]> {
    const query: Filter<TeamMember> = {
        userId: new ObjectId(userId),
    };
    if (since) {
        query.updatedAt = {
            $gt: since,
        };
    } else {
        query.status = status || 'a';
    }
    return TeamMemberCollection().find(query).toArray();
}

export default getMemberships;
