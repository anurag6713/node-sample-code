import {UserCollection, UserTokenCollection} from '@collections';
import userControllers from '@modules/user/controllers';
import userTokenControllers from '@modules/userToken/controllers';
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

describe('Get Token', () => {
    afterAll(async () => {
        const user = await getUser();
        await UserCollection().deleteOne({
            _id: user._id,
        });
        await UserTokenCollection().deleteMany({
            userId: user._id,
        });
    });

    it('Should throw an error', async () => {
        const response = await userTokenControllers.get({});
        if (response) {
            expect(response.status).toBe(400);
        } else {
            throw new Error('Invalid error ');
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
        const userToken = await UserTokenCollection().findOne({
            userId: user._id,
        });
        expect(user?._id).toBeDefined();

        // Make sure the output has accessCode returned to client
        expect(
            response.getBody().indexOf(userToken.accessCode),
        ).toBeGreaterThan(-1);

        // Get token
        const tokenResponse = await userTokenControllers.get({
            accessCode: userToken.accessCode,
        });
        if (tokenResponse) {
            const data = tokenResponse.data || {};
            expect(data?.token).toBeDefined();
            expect(data?.googleId).toBe(userData.id);
            expect(data?.email).toBe(userData.email);
            expect(data?.firstName).toBe(userData.name);
            expect(data?.lastName).toBe(userData.family_name);

            // Make sure accessCode cannot be used after it is used once
            const userTokenCheck = await UserTokenCollection().findOne({
                accessCode: userToken.accessCode,
            });
            expect(userTokenCheck).toBeFalsy();
        } else {
            throw new Error('Invalid token response');
        }
    });
});

async function getUser(): Promise<User> {
    return UserCollection().findOne({
        googleId: userData.id,
    });
}
