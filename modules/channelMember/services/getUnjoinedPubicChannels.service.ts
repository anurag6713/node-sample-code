import {ObjectId, Projection} from 'mongodb';

import {ChannelCollection} from '@collections';
import {collectionNames} from '@constants';

import type {_ID, Channel, Team, User} from '@customTypes';

async function getAll({
    userId,
    teamId,
    projection,
}: {
    userId: _ID<User>;
    teamId: _ID<Team>;
    projection?: Projection<Channel>;
}): Promise<Channel[]> {
    if (!projection) {
        projection = {
            _id: 1,
            name: 1,
            teamId: 1,
            isPrivate: 1,
            type: 1,
        };
    }

    const result = await ChannelCollection()
        .aggregate<Channel>([
            {
                $match: {
                    teamId: new ObjectId(teamId),
                    status: 'a',
                    isPrivate: {
                        $ne: true,
                    },
                },
            },
            {
                $lookup: {
                    from: collectionNames.CHANNEL_MEMBER,
                    let: {
                        channelId: '$_id',
                    },
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $and: [
                                        {
                                            $eq: ['$$channelId', '$channelId'],
                                        },
                                        {
                                            $eq: [
                                                '$userId',
                                                new ObjectId(userId),
                                            ],
                                        },
                                    ],
                                },
                            },
                        },
                    ],
                    as: 'membership',
                },
            },
            {
                $match: {
                    $or: [
                        {
                            'membership.0.status': 'd',
                        },
                        {
                            'membership.0': {
                                $exists: false,
                            },
                        },
                    ],
                },
            },
        ])
        .toArray();

    return result;
}

export default getAll;
