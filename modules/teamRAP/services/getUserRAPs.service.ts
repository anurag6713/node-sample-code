import {Document, ObjectId, Projection} from 'mongodb';

import {TeamMemberRAPCollection} from '@collections';
import {collectionNames} from '@constants';

import type {_ID, Team, TeamRAP, User} from '@customTypes';

async function getUserRAPs({
    userId,
    teamId,
    since,
    status,
    projection,
}: {
    userId: _ID<User>;
    teamId?: _ID<Team>;
    projection?: Projection<TeamRAP>;
    since?: number;
    status?: TeamRAP['status'];
}): Promise<TeamRAP[]> {
    const $match: Document = {
        userId: new ObjectId(userId),
        status: 'a',
    };
    if (teamId) {
        $match.teamId = new ObjectId(teamId);
    }
    const pipeline: Document[] = [
        {
            $match,
        },
        {
            $lookup: {
                from: collectionNames.TEAM_RAP,
                localField: 'roleId',
                foreignField: '_id',
                as: 'role',
            },
        },
        {
            $unwind: '$role',
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
                        'role.updatedAt': {
                            $gt: since,
                        },
                    },
                ],
            },
        });
    } else if (status) {
        pipeline.push({
            $match: {
                'role.status': status,
            },
        });
    }

    pipeline.push(
        // Decide updatedAt based on membership or channel
        {
            $addFields: {
                'role.updatedAt': {
                    $cond: [
                        {$gt: ['$updatedAt', '$role.updatedAt']},
                        '$updatedAt',
                        '$role.updatedAt',
                    ],
                },
            },
        },
        {
            $replaceRoot: {newRoot: '$role'},
        },
    );

    if (projection) {
        pipeline.push({
            $project: projection,
        });
    }

    const result = await TeamMemberRAPCollection()
        .aggregate<TeamRAP>(pipeline)
        .toArray();
    return result;
}

export default getUserRAPs;
