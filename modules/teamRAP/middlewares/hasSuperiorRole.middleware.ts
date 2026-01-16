import teamRAPServices from '@modules/teamRAP/services';

import type {
    GenericObject,
    InternalData,
    Middleware,
    Team,
    TeamRAP,
    _ID,
} from '@customTypes';

const hasSuperiorRole = (
    roleIdTeamIdResolve: (
        body: GenericObject,
        queryParams: GenericObject,
        iData: InternalData,
    ) => {roleId: _ID<TeamRAP>; teamId: _ID<Team>},
): Middleware => {
    return async (body, queryParams, iData) => {
        let roleId = body.roleId || queryParams.roleId;
        let teamId = body.teamId || queryParams.teamId;
        if (typeof roleIdTeamIdResolve === 'function') {
            const resolvedIds = roleIdTeamIdResolve(body, queryParams, iData);
            roleId = resolvedIds.roleId || roleId;
            teamId = resolvedIds.teamId || teamId;
        }
        const result = await teamRAPServices.hasSuperiorRole({
            roleId,
            teamId,
            userId: iData.userId,
        });
        if (!result) {
            return {
                status: 401,
                message: 'NO_PERMISSION',
            };
        }
        return true;
    };
};

export default hasSuperiorRole;
