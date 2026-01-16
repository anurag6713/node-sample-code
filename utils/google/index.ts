import axios from 'axios';

import querystring from 'querystring';

import config from '@config';
import utils from '@utils';

function getAuthURL({
    app,
    id,
    name,
    platform = 'web',
}: {
    app: 'master' | 'chat';
    id?: string;
    name?: string;
    platform?: string;
}): string {
    const rootUrl = 'https://accounts.google.com/o/oauth2/v2/auth';
    const options = {
        redirect_uri: config.GOOGLE.REDIRECT_URI,
        client_id: config.GOOGLE.CLIENT_ID,
        access_type: 'offline',
        response_type: 'code',
        prompt: 'consent',
        scope: [
            'https://www.googleapis.com/auth/userinfo.profile',
            'https://www.googleapis.com/auth/userinfo.email',
        ].join(' '),
        state: JSON.stringify({app, id, name, platform}),
    };
    return `${rootUrl}?${querystring.stringify(options)}`;
}

async function getTokens(code: string): Promise<{
    access_token: string;
    expires_in: number;
    refresh_token: string;
    scope: string;
    id_token: string;
} | null> {
    const url = 'https://oauth2.googleapis.com/token';
    const values = {
        code,
        client_id: config.GOOGLE.CLIENT_ID,
        client_secret: config.GOOGLE.CLIENT_SECRET,
        redirect_uri: config.GOOGLE.REDIRECT_URI,
        grant_type: 'authorization_code',
    };

    try {
        const response = await axios.post(url, querystring.stringify(values), {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
        });
        return response.data;
    } catch (e) {
        utils.log(e);
        return null;
    }
}

async function getUser(code: string): Promise<Record<string, string>> {
    const tokens = await getTokens(code);

    // Fetch the user's profile with the access token and bearer
    const googleUser = await axios
        .get(
            `https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${tokens.access_token}`,
            {
                headers: {
                    Authorization: `Bearer ${tokens.id_token}`,
                },
            },
        )
        .then((res) => res.data)
        .catch((error) => {
            throw new Error(error.message);
        });

    return googleUser;
}

export default {getAuthURL, getTokens, getUser};
