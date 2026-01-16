import {Filter, ObjectId} from 'mongodb';

import {TeamMemberRAPCollection} from '@collections';

import type {_ID, TeamMemberRAP, User} from '@customTypes';

async function getMemberships({
    since,
    status,
    userId,
}: {
    since?: number;
    status?: TeamMemberRAP['status'];
    userId: _ID<User>;
}): Promise<TeamMemberRAP[]> {
    const query: Filter<TeamMemberRAP> = {
        userId: new ObjectId(userId),
    };
    if (since) {
        query.updatedAt = {
            $gt: since,
        };
    } else {
        query.status = status || 'a';
    }
    return TeamMemberRAPCollection().find(query).toArray();
}

export default getMemberships;
