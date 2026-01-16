import WSE from '@constants/websocketEvents';
import channelUtils from '@modules/channel/utils';
import messageSchemas from '@modules/message/schemas';
import messageServices from '@modules/message/services';
import utils from '@utils';

import type {Controller} from '@customTypes';

const deleteMessage: Controller = async (_body, queryParams) => {
    try {
        const {channelId, messageId} = queryParams;

        const deletedMessage = await messageServices.deleteMessage(
            channelId,
            messageId,
        );

        if (deletedMessage) {
            channelUtils.sendWSMessageToChannel(
                channelId,
                {
                    type: WSE.MESSAGE_DELETED,
                    data: deletedMessage,
                },
                messageSchemas.messageWS,
            );
            return {status: 200};
        }

        return {message: 'SOMETHING_WENT_WRONG', status: 400};
    } catch (e) {
        utils.log(e);
        return {message: 'SOMETHING_WENT_WRONG', status: 500};
    }
};

export default deleteMessage;
