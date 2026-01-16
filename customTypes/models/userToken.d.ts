import {ObjectId} from 'mongodb';

import {_ID, Platform} from '../utils';

import {User} from './user';

export type UserToken = {
    _id: ObjectId;
    userId: _ID<User>;
    device: {
        id: string;
        name: string;
        token: string;
        platform: Platform;
    };
    token: string;
    accessCode: string; // Used onetime to get the token
    isActive: boolean;

    createdAt: number;
    lastConnectedAt: number;
    lastDisconnectedAt: number;
};

export type JWTData = {
    _id: _ID<UserToken>;
    userId: _ID<User>;
};
