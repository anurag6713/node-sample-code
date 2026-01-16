import {ObjectId} from 'mongodb';

import {TeamMemberCollection, UserCollection} from '@collections';
import utils from '@utils';

import type {TeamMember} from '@customTypes';

async function addMember(data: TeamMember): Promise<TeamMember | null> {
    const member = utils.pick(data, [
        'teamId',
        'roles',
        'userId',
    ]) as TeamMember;

    member.teamId = new ObjectId(member.teamId);
    member.userId = new ObjectId(member.userId);
    member.createdAt = Date.now();
    member.updatedAt = member.createdAt;
    member.status = 'a';

    // Check if the record already exists
    const previousMembership = await TeamMemberCollection().findOne(
        {
            teamId: member.teamId,
            userId: member.userId,
        },
        {
            projection: {
                _id: 1,
            },
        },
    );

    // If yes, modify the old record
    if (previousMembership) {
        const result = await TeamMemberCollection().updateOne(
            {
                _id: previousMembership._id,
            },
            {
                $set: {
                    updatedAt: Date.now(),
                    status: 'a',
                },
            },
        );
        if (result.modifiedCount) {
            member._id = previousMembership._id;
        }
    } else {
        // If not, create a new record
        const result = await TeamMemberCollection().insertOne(member);
        if (result.insertedId) {
            member._id = result.insertedId;
        }
    }

    if (!member._id) {
        return null;
    }

    // Add team to user collection as well
    await UserCollection().updateOne(
        {
            _id: member.userId,
        },
        {
            $addToSet: {
                teamIds: member.teamId,
            },
        },
    );

    return member;
}

export default addMember;
