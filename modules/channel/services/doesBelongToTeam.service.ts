import {ObjectId} from 'mongodb';

import {ChannelCollection} from '@collections';

import type {_ID, Channel, Team} from '@customTypes';

async function doesBelongToTeam(
    teamId: _ID<Team>,
    channelIds: _ID<Channel>[],
): Promise<boolean> {
    const result = await ChannelCollection()
        .find(
            {
                _id: {
                    $in: channelIds.map((channelId) => new ObjectId(channelId)),
                },
                teamId: new ObjectId(teamId),
            },
            {
                projection: {
                    _id: 1,
                },
            },
        )
        .toArray();
    if (result.length === channelIds.length) {
        return true;
    }
    return false;
}

export default doesBelongToTeam;
