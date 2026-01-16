import jwt from 'jsonwebtoken';
import {ObjectId} from 'mongodb';

import {UserTokenCollection} from '@collections';
import config from '@config';
import utils from '@utils';

import type {JWTData, UserToken} from '@customTypes';

async function createUserToken(
    userId: ObjectId,
    device: UserToken['device'],
): Promise<UserToken> {
    const _id = new ObjectId();
    const jwtData: JWTData = {
        _id,
        userId,
    };
    const accessCode = utils.generateToken();
    const token = jwt.sign(jwtData, config.SECRET_KEY, {
        expiresIn: '365 days',
    });
    const result = await UserTokenCollection().insertOne({
        _id,
        accessCode,
        userId,
        device,
        isActive: false,
        createdAt: Date.now(),
        lastConnectedAt: Date.now(),
        lastDisconnectedAt: Date.now(),
        token,
    });
    if (result.insertedId) {
        return {_id: result.insertedId, accessCode, token} as UserToken;
    }
    return null;
}

export default createUserToken;
