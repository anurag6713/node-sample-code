import {ObjectId} from 'mongodb';

import WSE from '@constants/websocketEvents';
import utils from '@utils';

import type {
    GenericObject,
    Schema,
    User,
    ValueOf,
    WebSocket,
} from '@customTypes';

const data: {
    [key: string]: WebSocket[];
} = {};

function add(_id: string, ws: WebSocket): void {
    if (!data[_id]) {
        data[_id] = [];
    }
    data[_id].push(ws);
}

function get(_id: string): WebSocket[] | undefined {
    return data[_id] || [];
}

function remove(_id: string, ws: WebSocket): void {
    const userWebsockets = get(_id);
    try {
        for (let i = 0; i < userWebsockets.length; i++) {
            if (userWebsockets[i].connectionId === ws.connectionId) {
                userWebsockets.splice(i, 1);
                userWebsockets[i]?.close();
                break;
            }
        }
    } catch (e) {
        utils.log('websocket -> users -> remove', e);
    }
}

function sendMessage(
    _ids: ObjectId | string | (ObjectId | string)[],
    message: {
        type: ValueOf<typeof WSE>;
        data: string | GenericObject;
        user?: User;
    },
    schema?: Schema,
    ws?: WebSocket,
): void {
    if (ws) {
        // if (!message.user) {
        //     message.user = {
        //         _id: ws.user._id,
        //     } as User;
        // }
        ws.send(schema ? schema(message) : JSON.stringify(message));
        return;
    }
    if (!Array.isArray(_ids)) {
        _ids = [_ids];
    }
    for (let i = 0; i < _ids.length; i++) {
        const userWebsockets = get(_ids[i].toString());
        for (let i = 0; i < userWebsockets.length; i++) {
            if (!message.user) {
                message.user = {
                    _id: userWebsockets[i].user._id,
                } as User;
            }
            userWebsockets[i].send(
                schema ? schema(message) : JSON.stringify(message),
            );
        }
    }
}

export default {
    add,
    get,
    remove,
    sendMessage,
};
