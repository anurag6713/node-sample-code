import userServices from '@modules/user/services';
import utils from '@utils';

import type {Controller} from '@customTypes';

const me: Controller = async (_body, _queryParams, iData) => {
    try {
        const data = await userServices.getBy('_id', iData.userId, {
            firstName: 1,
            lastName: 1,
            email: 1,
            dob: 1,
            gender: 1,
            image: 1,
            preferences: 1,
        });
        return {data};
    } catch (e) {
        utils.log(e);
        return {message: 'SOMETHING_WENT_WRONG', status: 500};
    }
};

export default me;
