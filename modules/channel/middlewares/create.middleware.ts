import {ObjectId} from 'mongodb';

import type {Middleware, Channel} from '@customTypes';

const TYPES: Array<Channel['type']> = ['dm', 'gm', 'c'];

const create = (): Middleware => {
    return async (body) => {
        const {header, name, purpose, type, teamId} = body as Channel;
        if (
            !name ||
            !type ||
            TYPES.indexOf(type) === -1 ||
            name.length > 24 ||
            (type === 'c' && (!teamId || !ObjectId.isValid(teamId))) ||
            header?.length > 1024 ||
            purpose?.length > 1024
        ) {
            return {
                status: 400,
                message: 'INVALID_INPUT',
            };
        }
        return true;
    };
};

export default create;
