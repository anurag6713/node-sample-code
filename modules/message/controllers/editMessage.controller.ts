import WSE from '@constants/websocketEvents';
import channelUtils from '@modules/channel/utils';
import messageSchemas from '@modules/message/schemas';
import messageServices from '@modules/message/services';
import utils from '@utils';

import type {Controller, Message} from '@customTypes';

const editMessage: Controller = async (body) => {
    try {
        const {_id, channelId, text} = body as Message;

        const editedMessage = await messageServices.editMessage(
            channelId,
            _id,
            text,
        );

        if (editedMessage) {
            channelUtils.sendWSMessageToChannel(
                channelId,
                {
                    type: WSE.MESSAGE_EDITED,
                    data: editedMessage,
                },
                messageSchemas.messageWS,
            );
            return {status: 200, data: editedMessage};
        }

        return {message: 'SOMETHING_WENT_WRONG', status: 400};
    } catch (e) {
        utils.log(e);
        return {message: 'SOMETHING_WENT_WRONG', status: 500};
    }
};

export default editMessage;
