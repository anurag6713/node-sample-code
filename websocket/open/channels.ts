import WSE from '@constants/websocketEvents';
import channelSchemas from '@modules/channel/schemas';
import channelMemberSchemas from '@modules/channelMember/schemas';
import channelMemberServices from '@modules/channelMember/services';
import channelRAPSchema from '@modules/channelRAP/schemas';
import channelRAPServices from '@modules/channelRAP/services';
import utils from '@utils';
import wsUsers from '@websocket/users';

import type {WebSocket} from '@customTypes';

async function channels(ws: WebSocket): Promise<void> {
    const {syncInfo, user} = ws;

    // Send channels list
    channelMemberServices
        .getChannels({
            userId: user._id,
            ...(syncInfo.channel ? {since: syncInfo.channel} : {status: 'a'}),
        })
        .then((channels) => {
            if (!channels.length) {
                return;
            }
            wsUsers.sendMessage(
                user._id,
                {
                    type: WSE.CHANNELS_LIST,
                    data: channels,
                },
                channelSchemas.getAllWS,
                ws,
            );
        })
        .catch((e) => {
            utils.log(e);
        });

    // Send channel memberships list
    channelMemberServices
        .getMemberships({
            userId: user._id,
            ...(syncInfo.channelMember
                ? {since: syncInfo.channelMember}
                : {status: 'a'}),
        })
        .then((memberships) => {
            if (!memberships.length) {
                return;
            }
            wsUsers.sendMessage(
                user._id,
                {
                    type: WSE.CHANNELS_MEMBERSHIPS,
                    data: memberships,
                },
                channelMemberSchemas.getMembershipsWS,
                ws,
            );
        })
        .catch((e) => {
            utils.log(e);
        });

    // Send channel unreads
    channelMemberServices
        .getUnreadsCount({userId: user._id})
        .then((unreads) => {
            wsUsers.sendMessage(
                user._id,
                {
                    type: WSE.CHANNNELS_UNREADS,
                    data: unreads,
                },
                channelMemberSchemas.unreadsCountWS,
                ws,
            );
        })
        .catch((e) => {
            utils.log(e);
        });

    // Send channel RAP data
    channelRAPServices
        .getUserRAPs({
            userId: user._id,
            ...(syncInfo.channelRAP
                ? {since: syncInfo.channelRAP}
                : {status: 'a'}),
        })
        .then((data) => {
            if (!data.length) {
                return;
            }
            wsUsers.sendMessage(
                user._id,
                {
                    type: WSE.CHANNELS_RAP_LIST,
                    data,
                },
                channelRAPSchema.getAllWS,
                ws,
            );
        })
        .catch((e) => {
            utils.log(e);
        });
}

export default channels;
