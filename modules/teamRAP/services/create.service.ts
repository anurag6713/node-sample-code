import {ObjectId} from 'mongodb';

import {TeamRAPCollection} from '@collections';
import utils from '@utils';

import type {TeamRAP} from '@customTypes';

async function create(data: TeamRAP): Promise<TeamRAP> {
    const rap = utils.pick(data, [
        'name',
        'permissions',
        'teamId',
        'createdBy',
    ]) as TeamRAP;
    rap.createdAt = Date.now();
    rap.createdBy = new ObjectId(rap.createdBy);
    rap.updatedAt = rap.createdAt;
    rap.status = 'a';
    const result = await TeamRAPCollection().insertOne(rap);
    if (result.insertedId) {
        rap._id = result.insertedId;
        return rap;
    }
    return null;
}

export default create;
