import {ObjectId} from 'mongodb';

import {ChannelRAPCollection} from '@collections';

import type {_ID, Channel, ChannelRAP} from '@customTypes';
import type {FindOptions, Projection} from 'mongodb';

async function getAll(
    channelId: _ID<Channel>,
    projection?: Projection<ChannelRAP>,
): Promise<ChannelRAP[]> {
    const options: FindOptions = {};
    if (projection) {
        options.projection = projection;
    }
    const result = await ChannelRAPCollection()
        .find(
            {
                channelId: new ObjectId(channelId),
            },
            options,
        )
        .toArray();
    return result;
}

export default getAll;
