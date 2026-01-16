import {ObjectId} from 'mongodb';

import {ChannelRAPCollection} from '@collections';

import type {ChannelRAP} from '@customTypes';

async function remove(data: ChannelRAP): Promise<ChannelRAP> {
    const {channelId, roleId} = data;

    const result = await ChannelRAPCollection().findOneAndUpdate(
        {
            roleId: new ObjectId(roleId),
            channelId: new ObjectId(channelId),
        },
        {
            $set: {
                status: 'd',
                updatedAt: Date.now(),
            },
        },
        {
            returnDocument: 'after',
        },
    );

    return result.value;
}

export default remove;
