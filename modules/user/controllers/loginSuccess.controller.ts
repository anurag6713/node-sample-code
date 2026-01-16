import config from '@config';
import userServices from '@modules/user/services';
import userTokenServices from '@modules/userToken/services';
import utils from '@utils';
import google from '@utils/google';

import type {Controller, GenericObject, User, UserToken} from '@customTypes';

const loginSuccess: Controller = async (
    _body,
    queryParams,
    _iData,
    _request,
    response,
) => {
    try {
        if (queryParams?.code) {
            let state: GenericObject = {};
            try {
                state = JSON.parse(queryParams.state || '{}');
            } catch (e) {
                somethingWentWrong();
                return;
            }

            const device = {
                id: state.id,
                name: state.name,
                platform: state.platform || 'web',
            } as UserToken['device'];

            const googleUser = await google.getUser(queryParams.code);

            let url;
            if (state.app === 'master') {
                url =
                    device.platform === 'web'
                        ? config.MASTER_CLIENT_BASE_URL
                        : config.MASTER_APP_SCHEME;
            } else {
                url =
                    device.platform === 'web'
                        ? config.CLIENT_BASE_URL
                        : config.APP_SCHEME;
            }

            if (googleUser) {
                const {
                    id: googleId,
                    email,
                    verified_email,
                    name,
                    given_name,
                    family_name,
                } = googleUser;
                if (verified_email) {
                    let user = await userServices.getBy('googleId', googleId);
                    if (!user) {
                        user = {
                            googleId,
                            email,
                            firstName: given_name || name,
                            lastName: family_name,
                        } as User;
                        const {insertedId} = await userServices.signup(user);
                        user._id = insertedId;
                    }
                    const userToken = await userTokenServices.createUserToken(
                        user._id,
                        device,
                    );
                    const redirectUrl = `${url}?accessCode=${userToken.accessCode}`;
                    response.writeStatus('200');
                    response.writeHeader('content-Type', 'text/html');
                    response.end(
                        renderMessage(`
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" style="width: 64px; height: 64px; fill: #3c763d">
                            <path stroke="green" d="M504 256c0 136.967-111.033 248-248 248S8 392.967 8 256 119.033 8 256 8s248 111.033 248 248zM227.314 387.314l184-184c6.248-6.248 6.248-16.379 0-22.627l-22.627-22.627c-6.248-6.249-16.379-6.249-22.628 0L216 308.118l-70.059-70.059c-6.248-6.248-16.379-6.248-22.628 0l-22.627 22.627c-6.248 6.248-6.248 16.379 0 22.627l104 104c6.249 6.249 16.379 6.249 22.628.001z"/>
                        </svg>
                        <h2>Authentication complete</h2>
                        <p id="redirecting-message">Redirecting you back to the app.</p>
                        <p id="close-tab-message" style="display: none">You can close this browser tab now.</p>
                        <p>If you are not redirected automatically, please click the <a href="${redirectUrl}">link</a>
                        <meta http-equiv="refresh" content="2; url=${redirectUrl}">
                        <script>
                            window.onload = function() {
                                setTimeout(function() {
                                    document.getElementById('redirecting-message').style.display = 'none';
                                    document.getElementById('close-tab-message').style.display = 'block';
                                }, 2000);
                            }
                        </script>
                        `),
                    );
                } else {
                    response.writeStatus('400');
                    response.writeHeader('content-Type', 'text/html');
                    response.end(
                        renderErrorMessage(
                            'Verify your gmail account to login to uclid',
                            url,
                        ),
                    );
                }
            } else {
                somethingWentWrong(url);
            }
        } else {
            somethingWentWrong();
        }
    } catch (e) {
        somethingWentWrong();
        utils.log(e);
    }

    function somethingWentWrong(location?: string) {
        response.writeStatus('500');
        response.writeHeader('content-Type', 'text/html');
        response.end(
            renderMessage(renderErrorMessage('Something went wrong', location)),
        );
    }
};

function renderErrorMessage(message: string, location?: string): string {
    const locationHTML = location
        ? `<a href="${location}">Back to app</a>`
        : '';
    return renderMessage(`
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512" style="width: 64px; height: 64px; fill: #ccc">
            <path d="M569.517 440.013C587.975 472.007 564.806 512 527.94 512H48.054c-36.937 0-59.999-40.055-41.577-71.987L246.423 23.985c18.467-32.009 64.72-31.951 83.154 0l239.94 416.028zM288 354c-25.405 0-46 20.595-46 46s20.595 46 46 46 46-20.595 46-46-20.595-46-46-46zm-43.673-165.346l7.418 136c.347 6.364 5.609 11.346 11.982 11.346h48.546c6.373 0 11.635-4.982 11.982-11.346l7.418-136c.375-6.874-5.098-12.654-11.982-12.654h-63.383c-6.884 0-12.356 5.78-11.981 12.654z"/>
        </svg>
        <h2>${message}</h2>
        ${locationHTML}
    `);
}

function renderMessage(message: string): string {
    return `
        <!DOCTYPE html>
        <html>
            <head>
                <meta charset="utf-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0, minimum-scale=1.0, user-scalable=yes, viewport-fit=cover">
                <style>
                    body {
                        color: #333;
                        background-color: #fff;
                        font-family: "Helvetica Neue",Helvetica,Arial,sans-serif;
                        font-size: 14px;
                        line-height: 1.42857143;
                    }
                    a {
                        color: #337ab7;
                        text-decoration: none;
                    }
                    a:focus, a:hover {
                        color: #23527c;
                        text-decoration: underline;
                    }
                    h2 {
                        font-size: 30px;
                        margin: 20px 0 10px 0;
                        font-weight: 500;
                        line-height: 1.1
                    }
                    p {
                        margin: 0 0 10px;
                    }
                    .message-container {
                        color: #555;
                        display: table-cell;
                        padding: 5em 0;
                        text-align: left;
                        vertical-align: top;
                    }
                </style>
            </head>
            <body>
                <!-- mobile app message -->
                <div class="message-container">
                    ${message}
                </div>
            </body>
        </html>
    `;
}

export default loginSuccess;
