import {ObjectId} from 'mongodb';

import {MessagesBucketCollection} from '@collections';

import type {_ID, Channel, Message} from '@customTypes';

type Deps = {
    channelId: _ID<Channel>;
    lastSyncAt: number;
};

type Result = {
    deleted: Message[];
    updated: Message[];
} | null;

async function getUpdatedMessages(data: Deps): Promise<Result> {
    let {channelId, lastSyncAt} = data;

    channelId = new ObjectId(channelId);
    lastSyncAt = Number(lastSyncAt);

    const result = await MessagesBucketCollection()
        .aggregate<Result>([
            {
                $match: {
                    channelId,
                    updatedAt: {$gt: lastSyncAt},
                },
            },
            {$unwind: '$messages'},
            {
                $match: {
                    $or: [
                        {'messages.updatedAt': {$gt: lastSyncAt}},
                        {'messages.deletedAt': {$gt: lastSyncAt}},
                    ],
                },
            },
            {
                $replaceRoot: {
                    newRoot: '$messages',
                },
            },
            {
                $facet: {
                    updated: [
                        {
                            $match: {deletedAt: 0},
                        },
                        {
                            $project: {
                                props: 1,
                                updatedAt: 1,
                                userId: 1,
                                text: 1,
                            },
                        },
                    ],
                    deleted: [
                        {
                            $match: {
                                deletedAt: {$ne: 0},
                            },
                        },
                        {
                            $project: {deletedAt: 1},
                        },
                    ],
                },
            },
        ])
        .toArray();

    if (result.length) {
        return result[0];
    }

    return null;
}

export default getUpdatedMessages;
