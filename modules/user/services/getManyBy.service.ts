import {ObjectId, Projection} from 'mongodb';

import {UserCollection} from '@collections';

import type {User} from '@customTypes';

async function getManyBy(
    key: string,
    value: (ObjectId | string)[],
    projection: Projection<User> = {
        _id: 1,
    },
): Promise<User[]> {
    const query = {
        [key]: {
            $in: key === '_id' ? value.map((_id) => new ObjectId(_id)) : value,
        },
    };
    const result = await UserCollection()
        .find(query, {
            projection,
        })
        .toArray();
    return result;
}

export default getManyBy;
