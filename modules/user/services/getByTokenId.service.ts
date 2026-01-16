import {ObjectId, Projection} from 'mongodb';

import {UserTokenCollection} from '@collections';
import {collectionNames} from '@constants';

import type {User} from '@customTypes';

async function getByTokenId(
    _id: ObjectId,
    projection: Projection<User> = {
        _id: 1,
    },
): Promise<null | User> {
    const result = await UserTokenCollection()
        .aggregate<User>([
            {
                $match: {
                    _id: new ObjectId(_id),
                },
            },
            {
                $lookup: {
                    from: collectionNames.USER,
                    localField: 'userId',
                    foreignField: '_id',
                    as: 'user',
                },
            },
            {
                $unwind: '$user',
            },
            {
                $replaceRoot: {newRoot: '$user'},
            },
            {
                $project: projection,
            },
        ])
        .toArray();
    if (result[0]) {
        return result[0];
    } else {
        return null;
    }
}

export default getByTokenId;
