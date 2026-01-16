import {MatchKeysAndValues, ObjectId} from 'mongodb';

import {UserTokenCollection} from '@collections';

import type {UserToken} from '@customTypes';

async function update(
    _id: ObjectId,
    $set: MatchKeysAndValues<UserToken>,
): Promise<boolean> {
    const result = await UserTokenCollection().updateOne(
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
