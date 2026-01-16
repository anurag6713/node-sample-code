import channelMemberServices from '@modules/channelMember/services';
import utils from '@utils';

import type {Controller} from '@customTypes';

const getUnjoinedPublicChannels: Controller = async (
    _body,
    queryParams,
    iData,
) => {
    try {
        const {teamId} = queryParams;
        const channels = await channelMemberServices.getUnjoinedPublicChannels({
            teamId,
            userId: iData.userId,
            projection: {
                name: 1,
                purpose: 1,
            },
        });
        return {
            data: channels,
        };
    } catch (e) {
        utils.log(e);
        return {message: 'SOMETHING_WENT_WRONG', status: 500};
    }
};

export default getUnjoinedPublicChannels;
