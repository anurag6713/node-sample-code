import {ObjectId} from 'mongodb';

import {MessagesBucketCollection} from '@collections';

import type {_ID, Message, Channel} from '@customTypes';

async function editMessage(
    channelId: _ID<Channel>,
    messageId: _ID<Message>,
    text: string,
): Promise<Message> {
    channelId = new ObjectId(channelId);
    messageId = new ObjectId(messageId);

    const updatedAt = Date.now();

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
                    deletedAt: 0,
                },
            },
        },
        {
            $set: {
                'messages.$.text': text,
                'messages.$.updatedAt': updatedAt,
                updatedAt,
            },
        },
    );

    if (result.acknowledged) {
        return {
            _id: messageId,
            updatedAt,
            text,
        } as Message;
    }

    return null;
}

export default editMessage;
