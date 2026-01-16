import {ObjectId} from 'mongodb';

import {ChannelMemberCollection, UserCollection} from '@collections';

import type {ChannelMember} from '@customTypes';

async function addUser(data: ChannelMember): Promise<ChannelMember | null> {
    const channelId = new ObjectId(data.channelId);
    const userId = new ObjectId(data.userId);
    const currentDate = Date.now();

    // Prepare the data object
    const member = {
        channelId,
        userId,
        lastViewedAt: Date.now(),
        createdAt: currentDate,
        updatedAt: currentDate,
        status: 'a',
    } as ChannelMember;

    // Check if the record already exists
    const previousMembership = await ChannelMemberCollection().findOne(
        {
            channelId,
            userId,
        },
        {
            projection: {
                _id: 1,
            },
        },
    );

    // If yes, modify the old record
    if (previousMembership) {
        const result = await ChannelMemberCollection().updateOne(
            {
                _id: previousMembership._id,
            },
            {
                $set: {
                    updatedAt: currentDate,
                    status: 'a',
                },
            },
        );
        if (result.modifiedCount) {
            member._id = previousMembership._id;
        }
    } else {
        // If not, create a new record
        const result = await ChannelMemberCollection().insertOne(member);
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
                channelIds: member.channelId,
            },
        },
    );

    return member;
}

export default addUser;
