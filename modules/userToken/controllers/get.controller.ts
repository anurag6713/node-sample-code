import userServices from '@modules/user/services';
import userTokenServices from '@modules/userToken/services';
import utils from '@utils';

import type {Controller} from '@customTypes';

const getToken: Controller = async (body) => {
    try {
        const {accessCode, app} = body;
        if (!accessCode) {
            return {status: 400, message: 'MISSING_INPUT'};
        }
        const userToken = await userTokenServices.getUserTokenBy(
            'accessCode',
            accessCode,
        );
        if (!userToken) {
            return {status: 404, message: 'NOT_FOUND'};
        }
        if (await userTokenServices.dropAccessCodeFromToken(userToken._id)) {
            const userData = await userServices.getBy('_id', userToken.userId, {
                googleId: 1,
                firstName: 1,
                lastName: 1,
                email: 1,
                dob: 1,
                gender: 1,
                image: 1,
                ...(app === 'master' ? {masterPreferences: 1} : {}),
            });
            if (!userData) {
                return {status: 404, message: 'NOT_FOUND'};
            }
            return {
                status: 200,
                data: {
                    ...userData,
                    token: userToken.token,
                },
            };
        }
        return {status: 500, message: 'SOMETHING_WENT_WRONG'};
    } catch (e) {
        utils.log(e);
        return {status: 500, message: 'SOMETHING_WENT_WRONG'};
    }
};

export default getToken;
