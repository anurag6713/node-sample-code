import {ObjectId} from 'mongodb';

import {TeamCollection} from '@collections';
import utils from '@utils';

import type {Team} from '@customTypes';

async function create(data: Team): Promise<Team | null> {
    const team = utils.pick(data, ['name', 'type', 'createdBy']) as Team;

    team.createdAt = Date.now();
    team.createdBy = new ObjectId(data.createdBy);
    team.updatedAt = team.createdAt;
    team.status = 'a';
    team.membersCount = 1;

    const result = await TeamCollection().insertOne(team);
    if (result.insertedId) {
        team._id = result.insertedId;
        return team;
    }
    return null;
}

export default create;
