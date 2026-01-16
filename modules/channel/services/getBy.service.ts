import {ObjectId, Projection} from 'mongodb';

import {ChannelCollection} from '@collections';

import type {Channel} from '@customTypes';
import type {Filter, FindOptions} from 'mongodb';

async function getBy(
    key: string,
    value: ObjectId | string,
    projection?: Projection<Channel>,
): Promise<Channel> {
    const query: Filter<Channel> = {
        [key]: key === '_id' ? new ObjectId(value) : value,
    };

    const options: FindOptions<Channel> = {};
    if (projection) {
        options.projection = projection;
    }

    const result = await ChannelCollection().findOne<Channel>(query, options);
    return result;
}

export default getBy;
