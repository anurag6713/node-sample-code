import {ObjectId} from 'mongodb';

import {TeamCollection, TeamMemberCollection} from '@collections';

import type {_ID, Team} from '@customTypes';

async function updateMembersCount(_id: _ID<Team>): Promise<number> {
    const count = await TeamMemberCollection().countDocuments({
        teamid: new ObjectId(_id),
        status: 'a',
    });
    await TeamCollection().updateOne(
        {
            _id: new ObjectId(_id),
        },
        {
            $set: {
                membersCount: count,
                updatedAt: Date.now(),
            },
        },
    );
    return count;
}

export default updateMembersCount;
