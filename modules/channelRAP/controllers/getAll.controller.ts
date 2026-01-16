import channelRAPServices from '@modules/channelRAP/services';
import utils from '@utils';

import type {Controller} from '@customTypes';

const getAll: Controller = async (_body, queryParams) => {
    try {
        const {channelId} = queryParams;
        const roles = await channelRAPServices.getAll(channelId);
        return {
            data: roles,
        };
    } catch (e) {
        utils.log(e);
        return {message: 'SOMETHING_WENT_WRONG', status: 500};
    }
};

export default getAll;
