import {ObjectId, Projection} from 'mongodb';

import {TeamCollection} from '@collections';

import type {Team} from '@customTypes';

async function getBy(
    key: string,
    value: ObjectId | string,
    projection: Projection<Team> = {
        _id: 1,
    },
): Promise<Team> {
    const query = {
        [key]: key === '_id' ? new ObjectId(value) : value,
    };
    const result = await TeamCollection().findOne<Team>(query, {
        projection,
    });
    return result;
}

export default getBy;
