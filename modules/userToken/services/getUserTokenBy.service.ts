import {ObjectId} from 'mongodb';

import {UserTokenCollection} from '@collections';

import type {UserToken} from '@customTypes';

async function getUserTokenBy(
    key: string,
    value: ObjectId | string,
): Promise<UserToken> {
    const query = {
        [key]: key === '_id' ? new ObjectId(value) : value,
    };
    return UserTokenCollection().findOne<UserToken>(query);
}

export default getUserTokenBy;
