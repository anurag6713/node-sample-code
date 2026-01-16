import type {User} from './models/user';
import type Request, {InternalData} from './request';
import type {Response} from './response';
import type {ObjectId} from 'mongodb';
import type uWebSockets from 'uWebSockets.js';

export type _ID<E extends {_id: ObjectId}> = E['_id'];

export type Complete<T> = {
    [P in keyof Required<T>]: Pick<T, P> extends Required<Pick<T, P>>
        ? T[P]
        : T[P] | undefined;
};

export type Controller = (
    body: GenericObject,
    queryParams?: GenericObject,
    iData?: InternalData,
    request?: Request,
    response?: uWebSockets.HttpResponse,
) => Promise<Response | void> | Response;

export type Gender = 'm' | 'f' | 'o';

export interface GenericObject {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [key: string]: any;
}

export type Platform = 'apn' | 'fcm' | 'web';

/**
 * Fast JSON Schema
 */
export type Schema = (doc: GenericObject) => string;

export type ValueOf<T> = T[keyof T];

export type WebSocket = uWebSockets.WebSocket & {
    connectionId: string;
    user: User;
    tokenId: ObjectId;
    syncInfo: {
        channel: number;
        channelMember: number;
        channelRAP: number;
        invite: number;
        team: number;
        teamMember: number;
        teamRAP: number;
        teamMemberRAP: number;
    };
};
