import {ObjectId, Projection} from 'mongodb';

import {UserCollection} from '@collections';
import {collectionNames} from '@constants';

import type {_ID, Channel, Team, User, TeamRAP} from '@customTypes';
import type {Document} from 'mongodb';

export type Props = {
    channelIds?: _ID<Channel>[];
    teamIds?: _ID<Team>[];
    roleIds?: _ID<TeamRAP>[];
    excludeChannelIds?: _ID<Channel>[];
    q?: string;

    skip?: number;
    limit?: number;

    onlineOnly?: boolean;
    getAll?: boolean;

    getTeamRoleIds?: boolean;

    projection?: Projection<Channel>;
};

async function getMembers({
    channelIds,
    teamIds,
    roleIds,
    excludeChannelIds,
    q,

    skip = 0,
    limit = 10,

    onlineOnly = false,
    getAll = false,
    getTeamRoleIds = false,

    projection,
}: Props): Promise<User[]> {
    const pipeline: Document[] = [];

    const $match = {
        $and: [],
    };

    if (channelIds || teamIds || roleIds) {
        if (channelIds) {
            $match.$and.push({
                channelIds: {
                    $in: channelIds.map((channelId) => new ObjectId(channelId)),
                },
            });
        }
        if (teamIds) {
            $match.$and.push({
                teamIds: {
                    $in: teamIds.map((teamId) => new ObjectId(teamId)),
                },
            });
        }
        if (roleIds) {
            $match.$and.push({
                roleIds: {
                    $in: roleIds.map((roleId) => new ObjectId(roleId)),
                },
            });
        }
        if (excludeChannelIds) {
            $match.$and.push({
                channelIds: {
                    $nin: excludeChannelIds.map(
                        (channelId) => new ObjectId(channelId),
                    ),
                },
            });
        }
    } else {
        return [];
    }

    if (q) {
        $match.$and.push({
            $or: [
                {
                    $text: {$search: q},
                },
                {
                    firstName: {
                        $regex: q,
                        $options: 'i',
                    },
                },
                {
                    lastName: {
                        $regex: q,
                        $options: 'i',
                    },
                },
                {
                    email: {
                        $regex: q,
                        $options: 'i',
                    },
                },
            ],
        });
    }

    if (onlineOnly) {
        $match.$and.push({
            isOnline: true,
        });
    }

    pipeline.push({
        $match,
    });

    if (projection) {
        pipeline.push({
            $project: projection,
        });
    }

    if (!getAll) {
        pipeline.push(
            {
                $skip: skip,
            },
            {
                $limit: limit,
            },
        );
    }

    if (getTeamRoleIds && teamIds.length === 1) {
        pipeline.push(
            {
                $lookup: {
                    from: collectionNames.TEAM_MEMBER_RAP,
                    let: {
                        userId: '$_id',
                    },
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $and: [
                                        {
                                            $eq: ['$userId', '$$userId'],
                                        },
                                        {
                                            $eq: [
                                                '$teamId',
                                                new ObjectId(teamIds[0]),
                                            ],
                                        },
                                    ],
                                },
                            },
                        },
                        {
                            $project: {
                                roleId: 1,
                            },
                        },
                    ],
                    as: 'roleIds',
                },
            },
            {
                $addFields: {
                    roleIds: {
                        $map: {
                            input: '$roleIds',
                            in: '$$this.roleId',
                        },
                    },
                },
            },
        );
    }

    const result = await UserCollection().aggregate<User>(pipeline).toArray();
    return result;
}

export default getMembers;
