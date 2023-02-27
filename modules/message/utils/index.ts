import userServices from '@modules/user/services';

import type {Message, User} from '@customTypes';

async function getAllUsersFromMessages(messages: Message[]): Promise<User[]> {
    const userIds = new Set<string>();

    // Get all the users in the messages
    messages.forEach((message) => {
        const {props} = message;
        if (props) {
            const {
                addedUserIds = [],
                addedBy,
                removedUserIds,
                removedBy,
            } = props;
            addedUserIds?.forEach((userId) => {
                userIds.add(userId.toString());
            });
            if (addedBy) {
                userIds.add(addedBy.toString());
            }

            removedUserIds?.forEach((userId) => {
                userIds.add(userId.toString());
            });
            if (removedBy) {
                userIds.add(removedBy.toString());
            }
        }
        if (message.userId) {
            userIds.add(message.userId.toString());
        }
    });

    return userServices.getManyBy('_id', [...userIds], {
        firstName: 1,
        lastName: 1,
    });
}

export default {getAllUsersFromMessages};
