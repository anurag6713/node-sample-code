import messageServices from '@modules/message/services';
import utils from '@utils';

import type {Controller, Message} from '@customTypes';

const newMessage: Controller = async (body, _queryParams, iData) => {
    try {
        const {channelId, tempId, ...rest} = body;

        if (
            await messageServices.doesMessageWithTempIdExist(channelId, tempId)
        ) {
            return {};
        }

        const createdAt = Date.now();
        const message = {
            channelId,
            tempId,
            userId: iData.userId,
            ...rest,
            createdAt,
        } as Message;

        const result = await messageServices.saveMessage(message);

        if (result._id) {
            // channelId is not saved in every message as per DB design,
            // So we will manually add it here
            result.channelId = channelId;
            return {
                data: result,
            };
        }
        return {message: 'SOMETHING_WENT_WRONG', status: 400};
    } catch (e) {
        utils.log(e);
        return {message: 'SOMETHING_WENT_WRONG', status: 500};
    }
};

export default newMessage;
