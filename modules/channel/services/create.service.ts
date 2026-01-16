import {ObjectId} from 'mongodb';

import {ChannelCollection} from '@collections';
import utils from '@utils';

import type {Channel} from '@customTypes';

async function create(data: Channel): Promise<Channel | null> {
    const channel = utils.pick(data, [
        'isDefault',
        'isPrivate',
        'name',
        'type',
        'purpose',
        'header',
        'teamId',
        'createdAt',
        'createdBy',
    ]) as Channel;

    if (ObjectId.isValid(channel.teamId)) {
        channel.teamId = new ObjectId(data.teamId);
    } else {
        delete channel.teamId;
    }

    if (channel.type === 'c' && channel.isPrivate) {
        channel.isPrivate = true;
    } else {
        delete channel.isPrivate;
    }

    channel.createdAt = channel.createdAt || Date.now();
    channel.updatedAt = channel.createdAt;
    channel.createdBy = new ObjectId(data.createdBy);
    channel.status = 'a';
    const result = await ChannelCollection().insertOne(channel);
    if (result.insertedId) {
        channel._id = result.insertedId;
        return channel;
    }
    return null;
}

export default create;
