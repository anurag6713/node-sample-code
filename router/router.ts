import jwt from 'jsonwebtoken';
import uWebSockets from 'uWebSockets.js';

import queryString from 'querystring';

import config from '@config';
import channelRoutes from '@modules/channel';
import channelMemberRoutes from '@modules/channelMember';
import channelRAPRoutes from '@modules/channelRAP';
import messageRoutes from '@modules/message';
import teamRoutes from '@modules/team';
import teamInviteRoutes from '@modules/teamInvite';
import teamMemberRoutes from '@modules/teamMember';
import teamRAPRoutes from '@modules/teamRAP';
import userRoutes from '@modules/user';
import userTokenRoutes from '@modules/userToken';
import utils from '@utils';

import echoJSON from './echoJSON';

import type {
    AllRoutes,
    Controller,
    GenericObject,
    JWTData,
    Middleware,
    Request,
    Routes,
    Route,
    Schema,
} from '@customTypes';

const allRoutes: Routes = [
    ...channelRoutes,
    ...channelMemberRoutes,
    ...channelRAPRoutes,
    ...messageRoutes,
    ...teamRoutes,
    ...teamInviteRoutes,
    ...teamMemberRoutes,
    ...teamRAPRoutes,
    ...userRoutes,
    ...userTokenRoutes,
    [
        'GET',
        '/',
        function () {
            return {
                status: 200,
                data: 'Server is up and running now ' + new Date().toString(),
            };
        },
    ],
];

const routes: AllRoutes = {
    GET: {},
    POST: {},
};

allRoutes.forEach((route: Route) => {
    // Add routes[METHOD][URL] = [CONTROLLER, SCHEMA, MIDDLEWARES];
    routes[route[0]][route[1]] = [route[2], route[3], route[4]];
});

async function router(
    request: Request,
    response: uWebSockets.HttpResponse,
): Promise<void> {
    try {
        const {url} = request;
        const {headers, method, query} = request;

        if (method === 'OPTIONS') {
            postEcho(
                request,
                echoJSON(response, {
                    status: 200,
                }),
            );
            return;
        }

        const {authorization} = headers;
        let jwtData: JWTData;
        if (authorization) {
            try {
                const token = authorization.substring(7);
                const verifiedObj = jwt.verify(
                    token,
                    config.SECRET_KEY,
                ) as JWTData;
                if (verifiedObj && verifiedObj._id) {
                    jwtData = verifiedObj;
                }
            } catch (e) {
                utils.log(e);
            }
        }
        let queryParams: GenericObject = {};
        if (query) {
            queryParams = queryString.parse(query) || {};
        }
        if (method && routes[method] && routes[method][url]) {
            const [controller, schema, middlewares]: [
                Controller,
                Schema,
                Middleware[],
            ] = routes[method][url];

            const body = request.body || {};

            if (middlewares && middlewares.length) {
                const resolvedSuccessfully = await resolveMiddleware(
                    middlewares,
                    body,
                    queryParams,
                    jwtData,
                    request,
                    response,
                );
                if (!resolvedSuccessfully) {
                    return;
                }
            }

            postEcho(
                request,
                echoJSON(
                    response,
                    await controller(
                        body,
                        queryParams,
                        jwtData,
                        request,
                        response,
                    ),
                    schema,
                ),
            );
        } else {
            postEcho(
                request,
                echoJSON(response, {
                    status: 404,
                    message: 'NOT_FOUND',
                }),
            );
        }
    } catch (e) {
        utils.log(e);
    }
}

export function postEcho(
    request: Request,
    response: uWebSockets.HttpResponse,
): void {
    utils.log(
        '\x1b[32m',
        '/' + request.method,
        '\x1b[0m',
        request.url,
        ' ',
        response?.statusCode || 'Manually handled',
    );
}

export async function resolveMiddleware(
    middlewares: Middleware[],
    body: GenericObject,
    queryParams: GenericObject,
    jwtData: JWTData,
    request: Request,
    response: uWebSockets.HttpResponse,
): Promise<boolean> {
    for (let i = 0; i < middlewares.length; i++) {
        const result = await middlewares[i](
            body,
            queryParams,
            jwtData,
            request,
            response,
        );
        if (result !== true) {
            if (utils.isObject(result as GenericObject)) {
                postEcho(request, echoJSON(response, result));
            }
            return false;
        }
    }
    return true;
}

export default router;
