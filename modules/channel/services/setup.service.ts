import create from './create.service';

import type {_ID, Team, User, Channel} from '@customTypes';

type Deps = {
    teamId: _ID<Team>;
    type: Team['type'];
    userId: _ID<User>;
};

async function setup({teamId, userId}: Deps): Promise<Channel[]> {
    const channels: Channel[] = [];

    const channel1Data = {
        name: 'General',
        type: 'c',
        teamId,
        isDefault: true,
        createdBy: userId,
    } as Channel;
    const channel1 = await create(channel1Data);
    channels.push(channel1);

    return channels;
}

export default setup;
