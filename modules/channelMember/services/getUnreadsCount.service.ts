/*
var timestamp = Date.now();
var objectId = ObjectID.createFromTime(timestamp / 1000);
*/

import {ObjectId} from 'mongodb';

import {ChannelMemberCollection} from '@collections';
import {collectionNames} from '@constants';

import type {_ID, Channel, User} from '@customTypes';

type Response = {
    [key: string]: [number, number];
};

async function getUnreadsCount({
    channelId,
    userId,
}: {
    channelId?: _ID<Channel>;
    userId: _ID<User>;
}): Promise<Response> {
    const $match: Record<string, string | ObjectId> = {
        userId: new ObjectId(userId),
        status: 'a',
    };
    if (channelId) {
        $match.channelId = new ObjectId(channelId);
    }
    const result = await ChannelMemberCollection()
        .aggregate<{
            channelId: ObjectId;
            unreads: number;
            lastMessageAt: number;
        }>([
            {
                $match,
            },
            {
                $lookup: {
                    from: collectionNames.MESSAGES_BUCKET,
                    let: {
                        channelId: '$channelId',
                        lastViewedAt: '$lastViewedAt',
                    },
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $and: [
                                        {$eq: ['$$channelId', '$channelId']},
                                        {
                                            $lt: [
                                                '$$lastViewedAt',
                                                '$lastMessageAt',
                                            ],
                                        },
                                    ],
                                },
                            },
                        },
                        {
                            $project: {
                                unreads: {
                                    $filter: {
                                        input: '$messages',
                                        as: 'message',
                                        cond: {
                                            $and: [
                                                {
                                                    $lt: [
                                                        '$$lastViewedAt',
                                                        '$$message.createdAt',
                                                    ],
                                                },
                                                {
                                                    $eq: [
                                                        '$$message.deletedAt',
                                                        0,
                                                    ],
                                                },
                                            ],
                                        },
                                    },
                                },
                            },
                        },
                        {
                            $group: {
                                _id: null,
                                unreads: {$sum: {$size: '$unreads'}},
                            },
                        },
                    ],
                    as: 'messages',
                },
            },
            {
                $unwind: '$messages',
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
                $project: {
                    _id: 0,
                    channelId: 1,
                    unreads: '$messages.unreads',
                    lastMessageAt: {
                        $arrayElemAt: ['$channel.lastMessageAt', 0],
                    },
                },
            },
        ])
        .toArray();

    const obj: Response = {};
    for (let i = 0; i < result.length; i++) {
        obj[String(result[i].channelId)] = [
            result[i].unreads,
            result[i].lastMessageAt || 0,
        ];
    }
    return obj;
}

export default getUnreadsCount;
