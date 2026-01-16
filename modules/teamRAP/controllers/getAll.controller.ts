import teamRAPServices from '@modules/teamRAP/services';
import utils from '@utils';

import type {Controller /*, TeamRAP*/} from '@customTypes';

const getAll: Controller = async (_body, queryParams) => {
    try {
        const {teamId} = queryParams;
        const roles = await teamRAPServices.getAll(teamId);
        return {
            data: roles,
        };
    } catch (e) {
        utils.log(e);
        return {message: 'SOMETHING_WENT_WRONG', status: 500};
    }
};

export default getAll;
