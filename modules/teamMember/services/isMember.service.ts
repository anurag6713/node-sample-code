import {ObjectId} from 'mongodb';

import {TeamMemberCollection} from '@collections';

import type {_ID, Team, User} from '@customTypes';

async function isMember(
    teamId: _ID<Team>,
    userIds: _ID<User>[],
): Promise<boolean> {
    const result = await TeamMemberCollection()
        .find(
            {
                teamId: new ObjectId(teamId),
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
