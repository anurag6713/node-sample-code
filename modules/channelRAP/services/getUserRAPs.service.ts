import {Filter, ObjectId, Projection} from 'mongodb';

import {ChannelRAPCollection} from '@collections';
import teamRAPServices from '@modules/teamRAP/services';

import type {_ID, Team, TeamRAP, User, ChannelRAP} from '@customTypes';

async function getUserRAPs({
    userId,
    channelId,
    since,
    status,
    projection,
}: {
    userId: _ID<User>;
    channelId?: _ID<Team>;
    projection?: Projection<TeamRAP>;
    since?: number;
    status?: TeamRAP['status'];
}): Promise<ChannelRAP[]> {
    status = status || 'a';
    const rolesData = await teamRAPServices.getUserRAPs({
        userId,
        status: since ? undefined : status,
        projection: {
            _id: 1,
        },
    });

    const $match: Filter<ChannelRAP> = {
        roleId: {$in: rolesData.map((role) => role._id)},
    };

    if (channelId) {
        $match.channelId = new ObjectId(channelId);
    }

    if (since) {
        $match.updatedAt = {
            $gt: since,
        };
    } else {
        $match.status = status;
    }

    const result = await ChannelRAPCollection()
        .find($match, {
            projection,
        })
        .toArray();

    return result;
}

export default getUserRAPs;
