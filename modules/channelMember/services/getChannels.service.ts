import {Document, ObjectId, Projection} from 'mongodb';

import {ChannelMemberCollection} from '@collections';
import collectionNames from '@constants/collectionNames';

import type {_ID, Channel, Team, User} from '@customTypes';

async function getChannels({
    isPrivate,
    userId,
    since,
    status,
    teamId,
    projection,
}: {
    isPrivate?: boolean;
    userId: _ID<User>;
    projection?: Projection<Channel>;
    since?: number;
    status?: Channel['status'];
    teamId?: 'me' | _ID<Team>;
}): Promise<Channel[]> {
    const pipeline: Document[] = [
        {
            // Select all channel with membership status 'a'
            $match: {
                userId: new ObjectId(userId),
                status: 'a',
            },
        },
        {
            $lookup: {
                from: collectionNames.CHANNEL,
                localField: 'channelId',
                foreignField: '_id',
                as: 'channel',
            },
        },
        {
            $unwind: '$channel',
        },
    ];

    const $match = {
        $and: [],
    };

    if (teamId) {
        if (teamId === 'me') {
            $match.$and.push({
                'channel.teamId': {
                    $exists: false,
                },
            });
        } else {
            $match.$and.push({
                'channel.teamId': new ObjectId(teamId),
            });
        }
    }

    if (isPrivate !== undefined) {
        if (isPrivate) {
            $match.$and.push({
                'channel.isPrivate': true,
            });
        } else {
            $match.$and.push({
                'channel.isPrivate': {
                    $exists: false,
                },
            });
        }
    }

    // 1. Get only updated ones from SINCE
    // 2. Get all irrespective of status
    if (since) {
        $match.$and.push({
            $or: [
                {
                    updatedAt: {
                        $gt: since,
                    },
                },
                {
                    'channel.updatedAt': {
                        $gt: since,
                    },
                },
            ],
        });
    } else if (status) {
        $match.$and.push({
            'channel.status': status,
        });
    }

    pipeline.push(
        {$match},
        // Decide updatedAt based on membership or channel
        {
            $addFields: {
                'channel.updatedAt': {
                    $cond: [
                        {$gt: ['$updatedAt', '$channel.updatedAt']},
                        '$updatedAt',
                        '$channel.updatedAt',
                    ],
                },
            },
        },
        {
            $replaceRoot: {newRoot: '$channel'},
        },
    );

    if (projection) {
        pipeline.push({
            $project: projection,
        });
    }

    const result = await ChannelMemberCollection()
        .aggregate<Channel>(pipeline)
        .toArray();

    return result;
}

export default getChannels;
