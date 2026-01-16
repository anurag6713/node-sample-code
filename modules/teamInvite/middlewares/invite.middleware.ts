import utils from '@utils';

import type {Middleware} from '@customTypes';

const invite = (): Middleware => {
    return async (body) => {
        const {emails, teamId} = body;
        if (
            !teamId ||
            !utils.isValidObjectId(teamId) ||
            !emails?.length ||
            emails.find((email: string) => !utils.regex.EMAIL.test(email))
        ) {
            return {
                status: 400,
                message: 'INVALID_INPUT',
            };
        }
        return true;
    };
};

export default invite;
