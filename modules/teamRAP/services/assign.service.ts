import {ObjectId} from 'mongodb';

import {TeamMemberRAPCollection, UserCollection} from '@collections';

import type {TeamMemberRAP} from '@customTypes';

async function assign(data: TeamMemberRAP): Promise<TeamMemberRAP> {
    const roleId = new ObjectId(data.roleId);
    const userId = new ObjectId(data.userId);

    const currentTS = Date.now();
    const memberRAP = {
        teamId: new ObjectId(data.teamId),
        userId,
        roleId,
        createdAt: currentTS,
        updatedAt: currentTS,
        status: 'a',
    } as TeamMemberRAP;

    // Check if user already has this role
    const previousMemberRAP = await TeamMemberRAPCollection().findOne({
        roleId: new ObjectId(data.roleId),
        userId: new ObjectId(data.userId),
    });

    // If yes, modify the old record
    if (previousMemberRAP) {
        const result = await TeamMemberRAPCollection().updateOne(
            {
                _id: previousMemberRAP._id,
            },
            {
                $set: {
                    updatedAt: currentTS,
                    status: 'a',
                },
            },
        );
        if (result.modifiedCount) {
            memberRAP._id = previousMemberRAP._id;
        }
    } else {
        // If not, create a new record
        const result = await TeamMemberRAPCollection().insertOne(memberRAP);
        if (result.insertedId) {
            memberRAP._id = result.insertedId;
        }
    }

    if (memberRAP._id) {
        // Add role to user collection as well
        await UserCollection().updateOne(
            {
                _id: userId,
            },
            {
                $addToSet: {
                    roleIds: memberRAP.roleId,
                },
            },
        );

        return memberRAP;
    }
    return null;
}

export default assign;
