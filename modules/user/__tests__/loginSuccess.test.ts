import {UserCollection, UserTokenCollection} from '@collections';
import userControllers from '@modules/user/controllers';
import {MockHttpResponse} from '@testUtils';

import type {User} from '@customTypes';

const response = new MockHttpResponse();

const userData = {
    id: 'googleID123',
    email: 'akira.test@uclid.com',
    verified_email: true,
    name: 'Akira',
    given_name: 'Akira',
    family_name: 'Shivarathri',
};

jest.mock('@utils/google', () => {
    return {
        getUser: () => new Promise((resolve) => resolve(userData)),
    };
});

describe('Login Success', () => {
    afterAll(async () => {
        const user = await getUser();
        await UserCollection().deleteOne({
            _id: user._id,
        });
        await UserTokenCollection().deleteMany({
            userId: user._id,
        });
    });

    it('Should throw an error', () => {
        const queryParams = [{}, {code: ''}, {state: '{}'}];
        for (let i = 0; i < queryParams.length; i++) {
            userControllers.loginSuccess(
                {},
                queryParams[i],
                undefined,
                undefined,
                response,
            );
            expect(response.status).toBe('500');
        }
    });

    it('Should signup the user if does not exist', async () => {
        await userControllers.loginSuccess(
            {},
            {
                code: '1234',
                state: JSON.stringify({
                    id: 'device id',
                    name: 'iPhone',
                    platform: 'ios',
                }),
            },
            undefined,
            undefined,
            response,
        );
        expect(response.status).toBe('200');

        const user = await getUser();
        expect(user?._id).toBeDefined();
    });
});

async function getUser(): Promise<User> {
    return UserCollection().findOne({
        googleId: userData.id,
    });
}
