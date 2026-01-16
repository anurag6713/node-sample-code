import {ObjectId} from 'mongodb';

import {TeamRAPCollection} from '@collections';
import utils from '@utils';

import type {TeamRAP} from '@customTypes';

async function edit(data: TeamRAP): Promise<TeamRAP> {
    const {_id, ...rest} = data;
    const finalData = utils.pick(rest, ['name', 'permissions']) as TeamRAP;
    finalData.updatedAt = Date.now();
    const result = await TeamRAPCollection().findOneAndUpdate(
        {
            _id: new ObjectId(_id),
        },
        {
            $set: finalData,
        },
        {
            returnDocument: 'after',
        },
    );
    return result.value;
}

export default edit;
