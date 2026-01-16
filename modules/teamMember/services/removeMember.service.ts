import {ObjectId} from 'mongodb';

import {TeamMemberCollection, UserCollection} from '@collections';

import type {_ID, Team, User, TeamMember} from '@customTypes';

async function removeMember(
    teamId: _ID<Team>,
    userId: _ID<User>,
): Promise<TeamMember> {
    teamId = new ObjectId(teamId);
    userId = new ObjectId(userId);
    const result = await TeamMemberCollection().findOneAndUpdate(
        {
            teamId,
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
                teamIds: teamId,
            },
        },
    );

    return result.value;
}

export default removeMember;
