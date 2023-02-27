import {ObjectId} from 'mongodb';

import {TeamRAPCollection, TeamMemberRAPCollection} from '@collections';
import {collectionNames} from '@constants';

import type {Team, TeamRAP, User, _ID} from '@customTypes';

type Deps = {
    roleId: _ID<TeamRAP>;
    teamId: _ID<Team>;
    userId: _ID<User>;
};

async function hasSuperiorRole({
    roleId,
    teamId,
    userId,
}: Deps): Promise<boolean> {
    const userRoles = await TeamMemberRAPCollection()
        .aggregate<{order: number}>([
            {
                $match: {
                    userId: new ObjectId(userId),
                    teamId: new ObjectId(teamId),
                    status: 'a',
                },
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
                $sort: {
                    'role.order': 1,
                },
            },
            {
                $limit: 1,
            },
            {
                $project: {
                    order: '$role.order',
                },
            },
        ])
        .toArray();
    if (userRoles?.length) {
        const {order} = userRoles[0];
        if (order !== undefined) {
            const result = await TeamRAPCollection().findOne(
                {
                    _id: new ObjectId(roleId),
                    order: {
                        $gt: order[0],
                    },
                    status: 'a',
                },
                {
                    projection: {
                        _id: 1,
                    },
                },
            );
            return Boolean(result);
        }
    }
    return false;
}

export default hasSuperiorRole;
