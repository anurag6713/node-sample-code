import {ObjectId} from 'mongodb';

import {TeamInviteCollection} from '@collections';

import type {_ID, User} from '@customTypes';

async function invitesRead(userId: _ID<User>): Promise<void> {
    await TeamInviteCollection().updateMany(
        {
            userId: new ObjectId(userId),
            isRead: false,
        },
        {
            $set: {
                isRead: true,
                updatedAt: Date.now(),
            },
        },
    );
}

export default invitesRead;
