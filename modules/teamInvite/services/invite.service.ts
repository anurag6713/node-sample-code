import {ObjectId} from 'mongodb';

import {TeamInviteCollection, UserCollection} from '@collections';
import {collectionNames} from '@constants';

import type {_ID, Team, User, TeamInvite} from '@customTypes';

type Deps = {
    createdBy: _ID<User>;
    emails: string[];
    teamId: _ID<Team>;
};

type QueryResult = {
    _id: ObjectId;
    email: string;
    membership: {_id: ObjectId}[];
    invite: {_id: ObjectId}[];
};

type Result = {
    inviteId: _ID<TeamInvite>;
    userId: _ID<User>;
}[];

async function invite({createdBy, emails, teamId}: Deps): Promise<Result> {
    createdBy = new ObjectId(createdBy);
    teamId = new ObjectId(teamId);

    // Look for existing users, who are not members of the team
    const users = await UserCollection()
        .aggregate<QueryResult>([
            {
                $match: {
                    email: {
                        $in: emails,
                    },
                },
            },
            {
                $lookup: {
                    from: collectionNames.TEAM_MEMBER,
                    let: {
                        userId: '$_id',
                    },
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $and: [
                                        {
                                            $eq: ['$teamId', teamId],
                                        },
                                        {
                                            $eq: ['$userId', '$$userId'],
                                        },
                                        {
                                            $eq: ['$status', 'a'],
                                        },
                                    ],
                                },
                            },
                        },
                        {
                            $project: {
                                _id: 1,
                            },
                        },
                    ],
                    as: 'membership',
                },
            },
            {
                $lookup: {
                    from: collectionNames.TEAM_INVITE,
                    let: {
                        userId: '$_id',
                    },
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $and: [
                                        {
                                            $eq: ['$teamId', teamId],
                                        },
                                        {
                                            $eq: ['$userId', '$$userId'],
                                        },
                                    ],
                                },
                            },
                        },
                        {
                            $project: {
                                _id: 1,
                            },
                        },
                    ],
                    as: 'invite',
                },
            },
            {
                $project: {
                    email: 1,
                    membership: 1,
                    invite: 1,
                },
            },
        ])
        .toArray();

    const operations = []; // All inserts will go into this
    const updations = {
        updateMany: {
            filter: {
                _id: {
                    $in: [], // All userIds will go into this
                },
            },
            update: {
                $set: {
                    isRead: false,
                    status: 'a',
                    createdBy,
                    updatedAt: Date.now(),
                },
            },
        },
    };

    const result: Result = [];

    for (let i = 0; i < emails.length; i++) {
        const email = emails[i];
        const data = users.find((user) => user.email === email);
        if (!data?.membership?.length) {
            if (data?.invite?.length) {
                updations.updateMany.filter._id.$in.push(data.invite[0]._id);
                result.push({
                    inviteId: data.invite[0]._id,
                    userId: data._id,
                });
            } else {
                const document = {
                    _id: new ObjectId(),
                    teamId,
                    isRead: false,
                    status: 'a',
                    createdBy,
                    createdAt: Date.now(),
                    updatedAt: Date.now(),
                } as TeamInvite;
                if (data?._id) {
                    document.userId = data._id;
                    result.push({
                        inviteId: document._id,
                        userId: data._id,
                    });
                } else {
                    document.email = email; // Unregistered user
                }
                operations.push({
                    insertOne: {
                        document,
                    },
                });
            }
        }
    }

    if (updations.updateMany.filter._id.$in.length) {
        operations.push(updations);
    }

    if (operations.length) {
        await TeamInviteCollection().bulkWrite(operations);
    }

    return result;
}

export default invite;
