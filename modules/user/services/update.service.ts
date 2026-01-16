import {MatchKeysAndValues, ObjectId} from 'mongodb';

import {UserCollection} from '@collections';

import type {User} from '@customTypes';

async function update(
    _id: ObjectId,
    $set: MatchKeysAndValues<User>,
): Promise<boolean> {
    const result = await UserCollection().updateOne(
        {
            _id: new ObjectId(_id),
        },
        {
            $set,
        },
    );
    return result.acknowledged;
}

export default update;
