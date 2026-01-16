import {ObjectId} from 'mongodb';

import {MessagesBucketCollection} from '@collections';
import {Channel, _ID} from '@customTypes';

async function doesMessageWithTempIdExist(
    channelId: _ID<Channel>,
    tempId: ObjectId,
): Promise<boolean> {
    const result = await MessagesBucketCollection().findOne(
        {
            channelId: new ObjectId(channelId),
            'messages.tempId': new ObjectId(tempId),
        },
        {
            projection: {
                _id: 1,
            },
        },
    );
    return Boolean(result);
}

export default doesMessageWithTempIdExist;
