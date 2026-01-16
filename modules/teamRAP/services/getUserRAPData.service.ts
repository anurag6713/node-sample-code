import {Document, ObjectId, Projection} from 'mongodb';

import {TeamMemberRAPCollection} from '@collections';

import type {_ID, Team, TeamMemberRAP, User} from '@customTypes';

async function getUserRAPData({
    userId,
    teamId,
    status,
    projection = {
        _id: 1,
    },
}: {
    userId: _ID<User>;
    teamId?: _ID<Team>;
    status?: TeamMemberRAP['status'];
    projection?: Projection<TeamMemberRAP>;
}): Promise<TeamMemberRAP[]> {
    const $match: Document = {
        userId: new ObjectId(userId),
    };
    if (teamId) {
        $match.teamId = new ObjectId(teamId);
    }
    if (status) {
        $match.status = status;
    }
    const result = await TeamMemberRAPCollection()
        .find($match, {
            projection,
        })
        .toArray();
    return result;
}

export default getUserRAPData;
