import {ObjectId} from 'mongodb';

import {ChannelRAPCollection} from '@collections';
import utils from '@utils';

import type {ChannelRAP} from '@customTypes';

async function edit(data: ChannelRAP): Promise<ChannelRAP> {
    const {channelId, roleId, ...rest} = data;

    const finalData = utils.pick(rest, [
        'permissions',
        'excludedPermissions',
    ]) as ChannelRAP;
    finalData.updatedAt = Date.now();

    finalData.status = 'a'; // Make it active as there could be old records with status 'd'

    // 1. Check if document exist for the role and channel
    const result = await ChannelRAPCollection().findOne({
        channelId: new ObjectId(channelId),
        roleId: new ObjectId(roleId),
    });

    // 2. If yes, update it
    if (result) {
        await ChannelRAPCollection().updateOne(
            {
                _id: result._id,
            },
            {
                $set: finalData,
            },
        );
        return {
            ...result,
            ...finalData,
        };
    }

    // 3. If no, insert one
    const insertedData: ChannelRAP = {
        channelId: new ObjectId(channelId),
        roleId: new ObjectId(roleId),
        ...finalData,
        createdAt: finalData.updatedAt,
        updatedAt: finalData.updatedAt,
    };

    await ChannelRAPCollection().insertOne(insertedData);

    return insertedData;
}

export default edit;
