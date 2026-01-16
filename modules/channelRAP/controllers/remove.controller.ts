// import teamRAPServices from '@modules/teamRAP/services';
import utils from '@utils';

import type {Controller /*, TeamRAP*/} from '@customTypes';

const remove: Controller = async () => {
    try {
        return {};
    } catch (e) {
        utils.log(e);
        return {message: 'SOMETHING_WENT_WRONG', status: 500};
    }
};

export default remove;
