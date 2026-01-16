import {ObjectId} from 'mongodb';

import {UserTokenCollection} from '@collections';

import type {_ID, User} from '@customTypes';

async function hasActiveToken(userId: _ID<User>): Promise<boolean> {
    const result = await UserTokenCollection().findOne(
        {
            userId: new ObjectId(userId),
            isActive: true,
        },
        {
            projection: {
                _id: 1,
            },
        },
    );
    return Boolean(result);
}

export default hasActiveToken;
