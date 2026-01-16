import config from '@config';
import userServices from '@modules/user/services';
import userTokenServices from '@modules/userToken/services';

import type {Controller} from '@customTypes';

const login: Controller = async (
    _body,
    queryParams,
    _iData,
    _request,
    response,
): Promise<void> => {
    const {email, id, name, platform} = queryParams;
    let url;
    if (platform === 'web') {
        url = config.CLIENT_BASE_URL;
    } else if (platform === 'android') {
        url = 'uclid://';
    } else {
        url = config.APP_SCHEME;
    }
    const user = await userServices.getBy('email', email);
    const userToken = await userTokenServices.createUserToken(user._id, {
        id,
        name,
        platform,
        token: '',
    });
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
};

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

export default login;
