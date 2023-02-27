import {Document, ObjectId} from 'mongodb';

import {MessagesBucketCollection} from '@collections';

import type {_ID, Channel, Message} from '@customTypes';
import type {Projection} from 'mongodb';

type GetMessagesOptions = {
    direction?: 'up' | 'down';
    channelId: _ID<Channel>;
    lastMessageId?: _ID<Message>; // Used to sync from the lastMessageId
    limit: number;
    minimumMessageId?: _ID<Message>; // Used to get latest messages which are always newer than this id
    projection?: Projection<Message>;
};

/**
 * Since we use Bucket pattern, we need to fetch messages from multiple buckets to 
 * get the required number of messages.
 */
async function getMessages(data: GetMessagesOptions): Promise<Message[]> {
    const {channelId, direction = 'up', projection} = data;
    direction;
    let {lastMessageId, limit, minimumMessageId} = data;
    lastMessageId = lastMessageId ? new ObjectId(lastMessageId) : null;
    minimumMessageId = minimumMessageId ? new ObjectId(minimumMessageId) : null;
    limit = Number(limit);

    let messages: Message[] = [];

    // Fetch atleast one bucket.
    do {
        const bucketMatch: Document = {
            channelId: new ObjectId(channelId),
        };

        const messagesMatch: Document = {
            $and: [{'messages.deletedAt': 0}],
        };
        if (minimumMessageId) {
            messagesMatch.$and.push({'messages._id': {$gt: minimumMessageId}});
        }

        let bucketSort = {
            createdAt: -1,
        };
        let messageSort = {
            'messages._id': -1,
        };

        if (lastMessageId) {
            if (direction === 'up') {
                bucketMatch.firstMessageId = {$lt: lastMessageId};
                messagesMatch.$and.push({
                    'messages._id': {$lt: lastMessageId},
                });
            } else {
                bucketMatch.$or = [
                    {
                        firstMessageId: {$gt: lastMessageId},
                    },
                    {
                        lastMessageId: {$gt: lastMessageId},
                    },
                ];
                messagesMatch.$and.push({
                    'messages._id': {$gt: lastMessageId},
                });
                bucketSort = {
                    createdAt: 1,
                };
                messageSort = {
                    'messages._id': 1,
                };
            }
        }

        // Reduce the limit if messages are fetched
        const limitLeft = limit - messages.length;

        const pipeline: Document[] = [
            {
                $match: bucketMatch,
            },
            {
                $sort: bucketSort,
            },
            {
                $limit: 1,
            },
            {
                $unwind: '$messages',
            },
        ];

        pipeline.push({
            $match: messagesMatch,
        });

        pipeline.push(
            {
                $sort: messageSort,
            },
            {
                $limit: limitLeft,
            },
            {
                $replaceRoot: {newRoot: '$messages'},
            },
        );

        if (projection) {
            pipeline.push({
                $project: projection,
            });
        }

        const result = await MessagesBucketCollection()
            .aggregate<Message>(pipeline)
            .toArray();

        messages = messages.concat(...result);

        if (messages.length) {
            lastMessageId = messages[messages.length - 1]._id;
        }

        if (!result.length || messages.length >= limit) {
            break;
        }
    } while (true);

    return messages;
}

export default getMessages;
