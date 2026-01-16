import {Document, ObjectId, Projection} from 'mongodb';

import {TeamMemberCollection} from '@collections';
import {collectionNames} from '@constants';

import type {_ID, Team, User} from '@customTypes';

async function getTeams({
    userId,
    since,
    status,
    projection,
}: {
    userId: _ID<User>;
    projection?: Projection<Team>;
    since?: number;
    status?: Team['status'];
}): Promise<Team[]> {
    const pipeline: Document[] = [
        {
            $match: {
                userId: new ObjectId(userId),
                status: 'a',
            },
        },
        {
            $lookup: {
                from: collectionNames.TEAM,
                localField: 'teamId',
                foreignField: '_id',
                as: 'team',
            },
        },
        {
            $unwind: '$team',
        },
    ];

    // 1. Get only updated ones from SINCE
    // 2. Get all irrespective of status
    if (since) {
        pipeline.push({
            $match: {
                $or: [
                    {
                        updatedAt: {
                            $gt: since,
                        },
                    },
                    {
                        'team.updatedAt': {
                            $gt: since,
                        },
                    },
                ],
            },
        });
    } else if (status) {
        pipeline.push({
            $match: {
                'team.status': status,
            },
        });
    }

    pipeline.push(
        // Decide updatedAt based on membership or channel
        {
            $addFields: {
                'team.updatedAt': {
                    $cond: [
                        {$gt: ['$updatedAt', '$team.updatedAt']},
                        '$updatedAt',
                        '$team.updatedAt',
                    ],
                },
            },
        },
        {
            $replaceRoot: {newRoot: '$team'},
        },
    );

    if (projection) {
        pipeline.push({
            $project: projection,
        });
    }

    const result = await TeamMemberCollection()
        .aggregate<Team>(pipeline)
        .toArray();
    return result;
}

export default getTeams;
