import type {Middleware, Team} from '@customTypes';

const TYPES: Array<Team['type']> = ['org', 'sg', 'o'];

const create = (): Middleware => {
    return async (body) => {
        const {name, type} = body as Team;
        if (!name || TYPES.indexOf(type) === -1 || name.length > 24) {
            return {
                status: 400,
                message: 'INVALID_INPUT',
            };
        }
        return true;
    };
};

export default create;
