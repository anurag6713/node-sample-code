import teamMemberServices from '@modules/teamMember/services';
import utils from '@utils';

import type {Controller} from '@customTypes';

const init: Controller = async (body, _queryParams, iData) => {
    try {
        const {since} = body;
        const {userId} = iData;

        // Teams
        const teams = await teamMemberServices.getTeams({
            userId,
            since,
        });

        return {
            data: {
                teams,
            },
        };
    } catch (e) {
        utils.log(e);
        return {message: 'SOMETHING_WENT_WRONG', status: 500};
    }
};

export default init;
