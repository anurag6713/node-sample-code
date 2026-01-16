import {ObjectId} from 'mongodb';

import WSE from '@constants/websocketEvents';
import messageServices from '@modules/message/services';
import teamMemberServices from '@modules/teamMember/services';
import wsUsers from '@websocket/users';

import type {
    Channel,
    GenericObject,
    Message,
    Schema,
    User,
    ValueOf,
    _ID,
} from '@customTypes';

function defaultChannelCreatedMessage(
    channelId: _ID<Channel>,
    userId: _ID<User>,
): Promise<Message> {
    const message = {
        channelId,
        tempId: new ObjectId(),
        type: 'c',
        props: {
            addedBy: userId,
        },
        createdAt: Date.now(),
        userId,
    } as Message;

    return messageServices.saveMessage(message);
}

// 1. When user is added by someone else
// 2. When user joins by themselves
function defaultChannelJoinedMessage(
    channelId: _ID<Channel>,
    addedUserIds: _ID<User>[],
    userId?: _ID<User>,
): Promise<Message> {
    const message = {
        channelId,
        tempId: new ObjectId(),
        type: 'j',
        props: {
            addedUserIds,
        },
        createdAt: Date.now(),
        userId,
    } as Message;

    if (userId) {
        message.props.addedBy = userId;
        message.userId = userId;
    } else {
        message.userId = addedUserIds[0];
    }

    return messageServices.saveMessage(message);
}

function defaultChannelLeaveMessage(
    channelId: _ID<Channel>,
    removedUserIds: _ID<User>[],
    userId?: _ID<User>,
): Promise<Message> {
    const message = {
        channelId,
        tempId: new ObjectId(),
        type: 'l',
        props: {
            removedUserIds,
        },
        createdAt: Date.now(),
    } as Message;

    if (userId) {
        message.props.removedBy = userId;
        message.userId = userId;
    } else {
        message.userId = removedUserIds[0];
    }

    return messageServices.saveMessage(message, false);
}

async function sendWSMessageToChannel(
    channelId: _ID<Channel>,
    message: {
        type: ValueOf<typeof WSE>;
        data: string | GenericObject;
    },
    schema?: Schema,
): Promise<void> {
    const onlineMembers = await teamMemberServices.getMembers({
        channelIds: [channelId],
        getAll: true,
        onlineOnly: true,
        projection: {
            _id: 1,
        },
    });

    const userIds = onlineMembers.map((user) => user._id);

    wsUsers.sendMessage(userIds, message, schema);
}

export default {
    defaultChannelCreatedMessage,
    defaultChannelJoinedMessage,
    defaultChannelLeaveMessage,
    sendWSMessageToChannel,
};
