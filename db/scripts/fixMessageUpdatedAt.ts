import {MessagesBucketCollection} from '@collections';

setTimeout(async () => {
    async function edit(channelId, messageId, updatedAt) {
        await MessagesBucketCollection().updateOne(
            {
                channelId,
                firstMessageId: {
                    $lte: messageId,
                },
                lastMessageId: {
                    $gte: messageId,
                },
                messages: {
                    $elemMatch: {
                        _id: messageId,
                    },
                },
            },
            {
                $set: {
                    'messages.$.updatedAt': updatedAt,
                },
            },
        );
    }
    edit;
    const buckets = await MessagesBucketCollection()
        .aggregate([
            {
                $match: {
                    messages: {
                        $exists: true,
                    },
                },
            },
        ])
        .toArray();
    buckets.forEach(async (bucket) => {
        bucket.messages.forEach(async (message) => {
            if (message.createdAt === message.updatedAt) {
                await edit(bucket.channelId, message._id, 0);
            }
        });
    });
}, 1000);
