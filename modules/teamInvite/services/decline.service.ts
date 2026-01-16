import {ObjectId} from 'mongodb';

import {TeamInviteCollection} from '@collections';

import type {_ID, TeamInvite, User} from '@customTypes';

type Deps = {
    _id: _ID<TeamInvite>;
    userId: _ID<User>;
};

async function decline({_id, userId}: Deps): Promise<void> {
    await TeamInviteCollection().updateOne(
        {
            _id: new ObjectId(_id),
            userId: new ObjectId(userId),
        },
        {
            $set: {
                status: 'd',
                updatedAt: Date.now(),
            },
        },
    );
}

export default decline;
