import {ObjectId, Projection} from 'mongodb';

import {ChannelRAPCollection} from '@collections';

import type {Channel, ChannelRAP, TeamRAP, _ID} from '@customTypes';
import type {FindOptions} from 'mongodb';

async function getBy(
    roleId: _ID<TeamRAP>,
    channelId: _ID<Channel>,
    projection?: Projection<ChannelRAP>,
): Promise<ChannelRAP> {
    const query = {
        roleId: new ObjectId(roleId),
        channelId: new ObjectId(channelId),
    };

    const options: FindOptions<ChannelRAP> = {};
    if (projection) {
        options.projection = projection;
    }

    const result = await ChannelRAPCollection().findOne<ChannelRAP>(
        query,
        options,
    );
    return result;
}

export default getBy;
