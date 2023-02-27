import {ObjectId} from 'mongodb';

import {TeamMemberRAPCollection} from '@collections';
import {collectionNames} from '@constants';

import type {_ID, Channel, Team, User} from '@customTypes';
import type {Document} from 'mongodb';

type Deps = {
    teamId: _ID<Team>;
    channelId?: _ID<Channel>;
    userId: _ID<User>;
    permission: string;
};

type Result = {
    channelRole: [
        {
            _id: ObjectId;
            isInPermissions: boolean;
            isInExcludedPermissions: boolean;
        },
    ];
    teamRole: [{_id: ObjectId; isOwner: boolean}];
};

/**
 * Case 1:
 * 1. User is owner of team
 *
 * Case 2:
 * 1. User team role has permission
 * 2. No channel level override
 *
 * Case 3:
 * 1. User team role doesn't have permission
 * 2. Channel level override has permission
 *
 * Case 4:
 * 1. User team role has permission
 * 2. Channel level override has excludedPermission
 *
 * Case 5:
 * 1. No team level override
 * 2. No channel level override
 */

async function hasPermission({
    teamId,
    channelId,
    userId,
    permission,
}: Deps): Promise<boolean> {
    const query: Document[] = [
        // 1. Match the user and team
        {
            $match: {
                userId: new ObjectId(userId),
                teamId: new ObjectId(teamId),
            },
        },

        // 2. Get team level permissions
        {
            $lookup: {
                from: collectionNames.TEAM_RAP,
                let: {roleId: '$roleId'},
                pipeline: [
                    {
                        $match: {
                            $expr: {
                                $and: [
                                    {
                                        $eq: ['$_id', '$$roleId'],
                                    },
                                    {
                                        $or: [
                                            {
                                                $eq: ['$isOwner', true],
                                            },
                                            {
                                                $in: [
                                                    permission,
                                                    '$permissions',
                                                ],
                                            },
                                        ],
                                    },
                                ],
                            },
                        },
                    },
                    {
                        $project: {
                            _id: 1,
                            isOwner: 1,
                        },
                    },
                ],
                as: 'teamRole',
            },
        },
    ];

    // 3. If channel is included, get channel level permissions
    if (channelId) {
        query.push({
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
                    {
                        $project: {
                            _id: '$roleId',
                            isInPermissions: {
                                $cond: [
                                    {
                                        $in: [permission, '$permissions'],
                                    },
                                    true,
                                    false,
                                ],
                            },
                            isInExcludedPermissions: {
                                $cond: [
                                    {
                                        $in: [
                                            permission,
                                            '$excludedPermissions',
                                        ],
                                    },
                                    true,
                                    false,
                                ],
                            },
                        },
                    },
                    {
                        $match: {
                            $expr: {
                                $or: [
                                    {
                                        $eq: ['$isInPermissions', true],
                                    },
                                    {
                                        $eq: ['$isInExcludedPermissions', true],
                                    },
                                ],
                            },
                        },
                    },
                ],
                as: 'channelRole',
            },
        });
    }

    query.push({
        $project: {
            _id: 0,
            channelRole: 1,
            teamRole: 1,
        },
    });

    const result = await TeamMemberRAPCollection()
        .aggregate<Result>(query)
        .toArray();

    for (let i = 0; i < result.length; i++) {
        const {channelRole: cR = [], teamRole: tR = []} = result[i];

        const teamRole = tR[0];
        if (teamRole?.isOwner) {
            return true;
        }

        const channelRole = cR[0];
        if (channelRole) {
            // If channel role is found, check if permission is in channel role
            if (channelRole.isInPermissions) {
                return true;
            }

            // If permission is excluded, skip the role
            if (channelRole.isInExcludedPermissions) {
                continue;
            }
        }

        // If channel role is not found/not overridden, team role takes precedence
        if (teamRole?._id) {
            return true;
        }
    }

    return false;
}

export default hasPermission;
