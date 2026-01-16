import google from '@utils/google';

import type {Controller} from '@customTypes';

const login: Controller = async (
    _body,
    queryParams,
    _iData,
    _request,
    response,
): Promise<void> => {
    const {app, id, name, platform} = queryParams;
    response.writeStatus('302');
    response.writeHeader(
        'location',
        google.getAuthURL({app, id, name, platform}),
    );
    response.end();
};

export default login;
