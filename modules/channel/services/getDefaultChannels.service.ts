import {ObjectId, Projection} from 'mongodb';

import {ChannelCollection} from '@collections';

import type {_ID, Team, Channel} from '@customTypes';
import type {FindOptions} from 'mongodb';

async function getDefaultChannels(
    teamId: _ID<Team>,
    projection?: Projection<Channel>,
): Promise<Channel[]> {
    let options: FindOptions<Channel>;
    if (projection) {
        options = {
            projection,
        };
    }

    const result = await ChannelCollection()
        .find(
            {
                teamId: new ObjectId(teamId),
                isDefault: true,
            },
            options,
        )
        .toArray();
    return result;
}

export default getDefaultChannels;
