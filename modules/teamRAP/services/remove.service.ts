import {ObjectId} from 'mongodb';

import {TeamMemberRAPCollection, UserCollection} from '@collections';

import type {_ID, User, TeamRAP, TeamMemberRAP} from '@customTypes';

async function remove(
    roleId: _ID<TeamRAP>,
    userId: _ID<User>,
): Promise<TeamMemberRAP> {
    roleId = new ObjectId(roleId);
    userId = new ObjectId(userId);
    const result = await TeamMemberRAPCollection().findOneAndUpdate(
        {
            roleId,
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
                roleIds: roleId,
            },
        },
    );

    return result.value;
}

export default remove;
