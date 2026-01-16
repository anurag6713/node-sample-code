import {Document, ObjectId, Projection} from 'mongodb';

import {MessagesBucketCollection} from '@collections';

import type {_ID, Channel, Message} from '@customTypes';

type Deps = {
    _id: _ID<Message>;
    channelId: _ID<Channel>;
    projection: Projection<Message>;
};

async function getMessage({
    _id,
    channelId,
    projection,
}: Deps): Promise<Message> {
    _id = new ObjectId(_id);
    channelId = new ObjectId(channelId);

    const pipeline: Document[] = [
        {
            $match: {
                channelId,
                firstMessageId: {$lte: _id},
                lastMessageId: {$gte: _id},
            },
        },
        {
            $project: {
                messages: {
                    $filter: {
                        input: '$messages',
                        as: 'message',
                        cond: {
                            $eq: ['$$message._id', _id],
                        },
                    },
                },
            },
        },
        {
            $unwind: '$messages',
        },
        {
            $replaceRoot: {newRoot: '$messages'},
        },
    ];

    if (projection) {
        pipeline.push({
            $project: projection,
        });
    }

    const result = await MessagesBucketCollection()
        .aggregate<Message>(pipeline)
        .toArray();

    if (result?.length) {
        return result[0];
    }

    return null;
}

export default getMessage;
