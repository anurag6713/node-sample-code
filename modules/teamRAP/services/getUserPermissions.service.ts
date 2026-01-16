import {Document, ObjectId} from 'mongodb';

import {TeamMemberRAPCollection} from '@collections';
import {collectionNames} from '@constants';

import type {_ID, Channel, Team, TeamRAP, User, ChannelRAP} from '@customTypes';

async function getUserPermissions(
    userId: _ID<User>,
    teamId: _ID<Team>,
    channelId?: _ID<Channel>,
): Promise<Set<string>> {
    const $match: Document = {
        userId: new ObjectId(userId),
        status: 'a',
        teamId: new ObjectId(teamId),
    };

    const pipeline: Document[] = [
        {
            $match,
        },
        {
            $lookup: {
                from: collectionNames.TEAM_RAP,
                localField: 'roleId',
                foreignField: '_id',
                as: 'teamRole',
            },
        },
        {
            $unwind: '$teamRole',
        },
        {
            $match: {
                'teamRole.status': 'a',
            },
        },
    ];

    if (channelId) {
        pipeline.push(
            {
                $lookup: {
                    from: collectionNames.CHANNEL_RAP,
                    let: {
                        roleId: '$roleId',
                    },
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $and: [
                                        {
                                            $eq: [
                                                '$channelId',
                                                new ObjectId(channelId),
                                            ],
                                        },
                                        {
                                            $eq: ['$roleId', '$$roleId'],
                                        },
                                    ],
                                },
                            },
                        },
                    ],
                    as: 'channelRole',
                },
            },
            {
                $unwind: '$channelRole',
            },
        );
    }

    pipeline.push({
        $project: {
            'teamRole.isOwner': 1,
            'teamRole.permissions': 1,
            'channelRole.permissions': 1,
            'channelRole.excludedPermissions': 1,
        },
    });

    const result = await TeamMemberRAPCollection()
        .aggregate<{teamRole: TeamRAP; channelRole: ChannelRAP}>(pipeline)
        .toArray();

    const permissions = [];
    for (let i = 0; i < result.length; i++) {
        if (result[i].teamRole.isOwner) {
            return new Set(['*']);
        }
        const permissionsList = new Set<string>(
            result[i].teamRole?.permissions || [],
        );
        if (result[i].channelRole) {
            result[i].channelRole.permissions?.forEach((p) =>
                permissionsList.add(p),
            );
            result[i].channelRole.excludedPermissions.forEach((p) =>
                permissionsList.delete(p),
            );
        }
        permissions.push(...permissionsList);
    }
    return new Set(permissions);
}

export default getUserPermissions;
