import teamRAPServices from '@modules/teamRAP/services';
import utils from '@utils';

import type {Controller, TeamRAP} from '@customTypes';

const create: Controller = async (body, _queryParams, iData) => {
    try {
        const {name, permissions, teamId} = body as Partial<TeamRAP>;
        const rap = await teamRAPServices.create({
            name,
            permissions,
            teamId,
            createdBy: iData.userId,
        } as TeamRAP);
        return {
            data: {
                _id: rap._id,
            },
        };
    } catch (e) {
        utils.log(e);
        return {message: 'SOMETHING_WENT_WRONG', status: 500};
    }
};

export default create;
