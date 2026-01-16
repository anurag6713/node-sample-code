import {InsertOneResult} from 'mongodb';

import {UserCollection} from '@collections';
import utils from '@utils';

import type {User} from '@customTypes';

async function signup(data: User): Promise<InsertOneResult<User>> {
    const user = utils.pick(data, [
        'googleId',
        'firstName',
        'lastName',
        'email',
        'dob',
        'gender',
        'image',
    ]) as User;
    const result = await UserCollection().insertOne(user);
    return result;
}

export default signup;
