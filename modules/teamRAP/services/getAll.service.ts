import {ObjectId} from 'mongodb';

import {TeamRAPCollection} from '@collections';

import type {_ID, Team, TeamRAP} from '@customTypes';
import type {FindOptions, Projection} from 'mongodb';

async function getAll(
    teamId: _ID<Team>,
    projection?: Projection<TeamRAP>,
): Promise<TeamRAP[]> {
    const options: FindOptions = {};
    if (projection) {
        options.projection = projection;
    }
    const result = await TeamRAPCollection()
        .find(
            {
                teamId: new ObjectId(teamId),
            },
            options,
        )
        .toArray();
    return result;
}

export default getAll;
