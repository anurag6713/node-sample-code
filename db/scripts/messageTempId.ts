import {ObjectId} from 'mongodb';

import {MessagesBucketCollection} from '@collections';

setTimeout(async () => {
    try {
        const buckets = await MessagesBucketCollection().find().toArray();
        for await (const bucket of buckets) {
            bucket.messages.forEach((message) => {
                message.tempId = new ObjectId(message.tempId);
            });
            await MessagesBucketCollection().updateOne(
                {
                    _id: bucket._id,
                },
                {
                    $set: {
                        messages: bucket.messages,
                    },
                },
            );
        }
    } catch (e) {
        console.log('ERRRROOOR', e);
    }
}, 2000);
