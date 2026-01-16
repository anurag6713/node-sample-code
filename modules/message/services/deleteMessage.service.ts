import {ObjectId} from 'mongodb';

import {MessagesBucketCollection} from '@collections';

import type {_ID, Message, Channel} from '@customTypes';

async function deleteMessage(
    channelId: _ID<Channel>,
    messageId: _ID<Message | null>,
): Promise<Message> {
    channelId = new ObjectId(channelId);
    messageId = new ObjectId(messageId);

    const deletedAt = Date.now();

    const result = await MessagesBucketCollection().updateOne(
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
                'messages.$.deletedAt': deletedAt,
                updatedAt: deletedAt,
            },
        },
    );

    if (result.acknowledged) {
        return {
            _id: messageId,
            deletedAt,
        } as Message;
    }

    return null;
}

export default deleteMessage;
