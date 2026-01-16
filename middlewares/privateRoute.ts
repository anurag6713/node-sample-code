import userTokenServices from '@modules/userToken/services';

import type {Middleware, UserToken} from '@customTypes';

const privateRoute = (): Middleware => {
    return async (_body, _queryParams, iData) => {
        let tokenData: UserToken;
        if (iData?._id) {
            tokenData = await userTokenServices.getUserTokenBy(
                '_id',
                iData._id,
            );
        }
        if (
            !tokenData ||
            !tokenData.token ||
            tokenData.token !== tokenData.token
        ) {
            return {
                status: 401,
                message: 'UNAUTHORIZED',
            };
        }
        return true;
    };
};

export default privateRoute;
