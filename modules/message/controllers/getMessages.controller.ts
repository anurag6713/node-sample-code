import messageServices from '@modules/message/services';
import messageUtils from '@modules/message/utils';
import utils from '@utils';

import type {Controller, Message} from '@customTypes';

const getMessages: Controller = async (_body, queryParams) => {
    try {
        const {channelId, lastMessageId, lastSyncAt, minimumMessageId, limit} =
            queryParams;

        // 1. Get Messages
        const messages = await messageServices.getMessages({
            channelId,
            lastMessageId,
            minimumMessageId,
            limit: limit,
        });

        // 2. Get lastMessageAt if minimumMessageId is provided
        let lastMessageAt: number;
        if (minimumMessageId && messages.length) {
            const sortedMessages = [...messages].sort(
                (a, b) => a.createdAt - b.createdAt,
            );
            const lastMessagesBlock = await messageServices.getMessages({
                channelId,
                lastMessageId: sortedMessages[0]._id,
                limit: 1,
                projection: {
                    createdAt: 1,
                },
            });
            if (lastMessagesBlock?.length) {
                lastMessageAt = lastMessagesBlock[0].createdAt;
            }
        }

        // 3. Get updated messages from lastSyncAt (OPTIONAL)
        let updated: Message[] = [];
        let deleted: Message[] = [];
        if (lastSyncAt) {
            const updatedResult = await messageServices.getUpdatedMessages({
                channelId,
                lastSyncAt,
            });
            if (updatedResult) {
                updated = updatedResult.updated;
                deleted = updatedResult.deleted;
            }
        }

        // 4. Get users data from all the messages to fetch and 
        //    send user data only once to the client
        const users = await messageUtils.getAllUsersFromMessages([
            ...messages,
            ...updated,
        ]);

        return {
            data: {
                messages,
                users,
                updated,
                deleted,
                lastMessageAt,
            },
        };
    } catch (e) {
        utils.log(e);
        return {message: 'SOMETHING_WENT_WRONG', status: 500};
    }
};

export default getMessages;
