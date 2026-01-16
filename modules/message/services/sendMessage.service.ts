import {ObjectId} from 'mongodb';

import WSE from '@constants/websocketEvents';
import messageSchemas from '@modules/message/schemas';
import teamMemberServices from '@modules/teamMember/services';
import wsUsers from '@websocket/users';

import type {Message, User} from '@customTypes';

async function sendMessage(
    channelId: ObjectId,
    messages: Message[],
    users: User[], // Users data that needs to be sent to the client
    lastMessageAt?: number,
): Promise<void> {
    const onlineChannelMembers = await teamMemberServices.getMembers({
        channelIds: [channelId],
        getAll: true,
        onlineOnly: true,
        projection: {
            _id: 1,
        },
    });

    const userIds = onlineChannelMembers.map((user) => user._id);

    wsUsers.sendMessage(
        userIds,
        {
            type: WSE.MESSAGE_RECEIVED,
            data: {
                messages,
                users,
                lastMessageAt,
            },
        },
        messageSchemas.newMessageWS,
    );
}

export default sendMessage;
