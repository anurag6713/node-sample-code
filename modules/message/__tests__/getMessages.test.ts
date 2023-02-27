import {ObjectId} from 'mongodb';

import {MessagesBucketCollection} from '@collections';
import messageServices from '@modules/message/services';

import type {MessagesBucket, Message} from '@customTypes';

const userId = new ObjectId();
const channelId = new ObjectId();

const allCreatedMessages: Message[] = [];

describe('Get Messages', () => {
    afterAll(async () => {
        await MessagesBucketCollection().deleteMany({
            channelId,
        });
    });

    it('Should get last 10 messages from last bucket', async () => {
        // Insert 20 messages
        const messages = await createMessagesBucket(20, 'B1');

        const result = await messageServices.getMessages({
            channelId,
            limit: 10,
        });

        expect(result.map((message) => message._id)).toEqual(
            messages
                .slice(10)
                .map((message) => message._id)
                .reverse(),
        );
    });

    it('Shoud get messages across different buckets', async () => {
        // Insert 10 new messages
        await createMessagesBucket(10, 'B2');

        const result = await messageServices.getMessages({
            channelId,
            limit: 30,
        });

        expect(result.map((message) => message._id)).toEqual(
            allCreatedMessages.map((message) => message._id).reverse(),
        );
    });

    it('Should get messages "down"wards with lastMessageId across multiple buckets', async () => {
        // Insert 10 new messages
        await createMessagesBucket(10, 'B3');

        // Bucket 1, 10th Message
        const lastMessageId = allCreatedMessages[9]._id;

        // Should fetch 10 messages in Bucket 1, 10 messages in Bucket 2, 10 messages in Bucket 3
        const result = await messageServices.getMessages({
            channelId,
            direction: 'down',
            lastMessageId,
            limit: 30,
        });

        expect(result.map((message) => message._id)).toEqual(
            allCreatedMessages.slice(10).map((message) => message._id),
        );
    });

    it('Should get messages "up"wards with lastMessageId across multiple buckets', async () => {
        const lastMessageId = allCreatedMessages[35]._id;

        // Should fetch 5 messages in Bucket 3, 10 messages in Bucket 2, 10 messages in Bucket 1
        const result = await messageServices.getMessages({
            channelId,
            direction: 'up',
            lastMessageId,
            limit: 25,
        });

        expect(result.map((message) => message._id)).toEqual(
            allCreatedMessages
                .slice(10, 35)
                .map((message) => message._id)
                .reverse(),
        );
    });

    it('Should get messages respecting the minimumMessageId across multiple buckets', async () => {
        const minimumMessageId = allCreatedMessages[25]._id;

        // Should fetch 10 messages from Bucket 3, 4 messages in Bucket 2
        const result = await messageServices.getMessages({
            channelId,
            direction: 'up',
            minimumMessageId,
            limit: 25,
        });

        expect(result.map((message) => message._id)).toEqual(
            allCreatedMessages
                .slice(26, 40)
                .map((message) => message._id)
                .reverse(),
        );
    });
});

async function createMessagesBucket(count: number, prefix = '') {
    const messages: Message[] = [];
    for (let i = 0; i < count; i++) {
        messages.push({
            _id: new ObjectId(),
            tempId: new ObjectId(),
            text: prefix + '-Message: ' + (i + 1),
            userId,
            createdAt: Date.now(),
            updatedAt: 0,
            deletedAt: 0,
        } as Message);
    }
    allCreatedMessages.push(...messages);

    // Insert into messages bucket
    await MessagesBucketCollection().insertOne({
        channelId,
        count,
        messages,
        firstMessageId: messages[0]._id,
        lastMessageId: messages[messages.length - 1]._id,
        lastMessageAt: messages[messages.length - 1].createdAt,
        createdAt: Date.now(),
        updatedAt: 0,
    } as MessagesBucket);

    return messages;
}
