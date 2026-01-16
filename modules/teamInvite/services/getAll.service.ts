import {ObjectId} from 'mongodb';

import {TeamInviteCollection} from '@collections';
import {collectionNames} from '@constants';

import type {_ID, Team, TeamInvite, User} from '@customTypes';

type Deps = {
    userId: _ID<User>;
    since?: number;
};

type Result = Omit<TeamInvite, 'createdBy' | 'userId'> & {
    team: Team;
};

async function getInvites({userId, since}: Deps): Promise<Result[]> {
    const $match: Record<string, unknown> = {
        userId: new ObjectId(userId),
    };
    if (since) {
        $match.updatedAt = {$gt: since};
    } else {
        $match.status = 'a';
    }
    return await TeamInviteCollection()
        .aggregate<Result>([
            {
                $match,
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
            {
                $project: {
                    isRead: 1,
                    teamId: 1,
                    team: {
                        _id: 1,
                        name: 1,
                    },
                    status: 1,
                    createdAt: 1,
                    updatedAt: 1,
                },
            },
        ])
        .toArray();
}

export default getInvites;
