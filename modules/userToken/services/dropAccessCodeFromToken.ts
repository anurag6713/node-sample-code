import {ObjectId} from 'mongodb';

import {UserTokenCollection} from '@collections';

async function deleteUserToken(_id: ObjectId): Promise<boolean> {
    const result = await UserTokenCollection().updateOne(
        {
            _id: new ObjectId(_id),
        },
        {
            $unset: {
                accessCode: true,
            },
        },
    );
    return result.acknowledged;
}

export default deleteUserToken;
