import {ObjectId} from 'mongodb';

import type {Middleware, TeamRAP} from '@customTypes';

const editPermissions = (): Middleware => {
    return async (body) => {
        const {_id} = body as TeamRAP;
        if (!_id || !ObjectId.isValid(_id)) {
            return {
                status: 400,
                message: 'INVALID_INPUT',
            };
        }

        return true;
    };
};

export default editPermissions;
