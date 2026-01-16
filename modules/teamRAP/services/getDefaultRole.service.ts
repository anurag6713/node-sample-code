import {ObjectId, Projection} from 'mongodb';

import {TeamRAPCollection} from '@collections';

import type {_ID, Team, TeamRAP} from '@customTypes';

async function getDefaultRole(
    teamId: _ID<Team>,
    projection?: Projection<TeamRAP>,
): Promise<TeamRAP> {
    const result = await TeamRAPCollection().findOne(
        {
            teamId: new ObjectId(teamId),
            isDefault: true,
        },
        {
            projection,
        },
    );
    return result;
}

export default getDefaultRole;
