import {ObjectId, Projection} from 'mongodb';

import {UserCollection} from '@collections';

import type {User} from '@customTypes';

async function getBy(
    key: string,
    value: ObjectId | string,
    projection: Projection<User> = {
        _id: 1,
    },
): Promise<User> {
    const query = {
        [key]: key === '_id' ? new ObjectId(value) : value,
    };
    const result = await UserCollection().findOne(query, {
        projection,
    });
    return result;
}

export default getBy;
