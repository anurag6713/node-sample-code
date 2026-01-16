import {ObjectId, Projection} from 'mongodb';

import {TeamInviteCollection} from '@collections';

import type {TeamInvite} from '@customTypes';

async function getBy(
    _id: ObjectId | string,
    projection: Projection<TeamInvite> = {
        _id: 1,
    },
): Promise<TeamInvite> {
    const result = await TeamInviteCollection().findOne<TeamInvite>(
        {
            _id: new ObjectId(_id),
        },
        {
            projection,
        },
    );
    return result;
}

export default getBy;
