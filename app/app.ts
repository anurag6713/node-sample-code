import uWebSockets from 'uWebSockets.js';

import websocket from '@websocket';

import readJSON from './readJSON';

import type {Request} from '@customTypes';

function app(
    port: number,
    router: (request: Request, response: uWebSockets.HttpResponse) => void,
): uWebSockets.TemplatedApp {
    return uWebSockets
        .App()
        .ws('/*', websocket)
        .any('/*', (res, req) => {
            const request: Request = {
                url: req.getUrl(),
                method: req.getMethod().toUpperCase(),
                headers: {
                    authorization: req.getHeader('authorization'),
                },
                query: req.getQuery(),
            };
            if (req.getMethod() === 'post') {
                readJSON(
                    res,
                    (body) => {
                        request.body = body;
                        router(request, res);
                    },
                    () => {
                        // eslint-disable-next-line @typescript-eslint/no-var-requires
                        require('../router/echoJSON').default(res, {
                            status: 500,
                            message: 'SOMETHING_WENT_WRONG',
                        });
                    },
                );
            } else {
                res.onData((_ab, isLast) => {
                    if (isLast) {
                        router(request, res);
                    }
                });
                res.onAborted(() => {
                    console.log('Request Aborted');
                });
            }
        })
        .listen(port, (listenSocket) => {
            if (listenSocket) {
                console.log('API Running on: ' + port);
            }
        });
}

export default app;
