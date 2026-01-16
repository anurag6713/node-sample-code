import {ObjectId} from 'mongodb';

import {MessagesBucketCollection} from '@collections';
import config from '@config';
import channelServices from '@modules/channel/services';
import channelMemberServices from '@modules/channelMember/services';
import messageServices from '@modules/message/services';
import userServices from '@modules/user/services';
import utils from '@utils';

import type {Message, MessagesBucket} from '@customTypes';

type Deps = Message;

async function saveMessage(
    data: Deps,
    updateLastViewedAt = true,
    updateLastMessageAt = true,
    sendMessage = true,
): Promise<Message | null> {
    const {
        channelId: channelIdStr,
        createdAt,
        tempId,
        text,
        type,
        props,
        userId,
    } = utils.pick(data, [
        'channelId',
        'createdAt',
        'tempId',
        'text',
        'type',
        'props',
        'userId',
    ]) as Message;

    const allUserIds = new Set<string>();
    allUserIds.add(userId.toString());

    const processedProps = {} as Message['props'];
    if (props?.addedUserIds?.length) {
        processedProps.addedUserIds = props.addedUserIds.map((_id) => {
            allUserIds.add(_id.toString());
            return new ObjectId(_id);
        });
    }
    if (props?.addedBy) {
        processedProps.addedBy = new ObjectId(props.addedBy);
        allUserIds.add(props.addedBy.toString());
    }
    if (props?.removedUserIds?.length) {
        processedProps.removedUserIds = props.removedUserIds.map((_id) => {
            allUserIds.add(_id.toString());
            return new ObjectId(_id);
        });
    }
    if (props?.removedBy) {
        processedProps.removedBy = new ObjectId(props.removedBy);
        allUserIds.add(props.removedBy.toString());
    }

    const channelId = new ObjectId(channelIdStr);

    const date = createdAt ?? Date.now();

    const messageId = new ObjectId();
    const message = {
        _id: messageId,
        tempId: new ObjectId(tempId),
        type,
        props: processedProps,
        createdAt: date,
        updatedAt: 0,
        deletedAt: 0,
    } as Message;

    if (text) {
        message.text = text;
    }

    if (userId) {
        message.userId = new ObjectId(userId);
    }

    const lastBucket = await MessagesBucketCollection().findOne(
        {
            channelId,
            type: 'm',
        },
        {
            projection: {
                count: 1,
            },
        },
    );

    if (!lastBucket || lastBucket.count === config.MESSAGES_PER_BUCKET) {
        const bucket = {
            count: 1,
            messages: [message],
            channelId,
            firstMessageId: messageId,
            lastMessageId: messageId,
            lastMessageAt: date,
            type: 'm',
            createdAt: date,
            updatedAt: 0,
        } as MessagesBucket;
        await MessagesBucketCollection().insertOne(bucket);
    } else {
        await MessagesBucketCollection().updateOne(
            {
                _id: lastBucket._id,
            },
            {
                $push: {
                    messages: message,
                },
                $set: {
                    lastMessageId: messageId,
                    lastMessageAt: date,
                },
                $inc: {
                    count: 1,
                },
            },
        );
    }
    message.channelId = channelId;

    // Send message to the channel
    if (sendMessage) {
        // Send lastMessageAt to the client to not create gap between messages
        const {lastMessageAt} = await channelServices.getBy('_id', channelId, {
            lastMessageAt: 1,
        });
        const users = await userServices.getManyBy('_id', [...allUserIds], {
            firstName: 1,
            lastName: 1,
        });
        await messageServices.sendMessage(
            channelId,
            [message],
            users,
            lastMessageAt,
        );
    }

    // Update Last Message At
    if (updateLastMessageAt) {
        await channelServices.updateLastMessageAt(channelId, createdAt);
    }

    // Update Last Viewed At for the user
    if (updateLastViewedAt) {
        await channelMemberServices.updateLastViewedAt(
            channelId,
            userId,
            createdAt,
        );
    }

    return message;
}

export default saveMessage;
