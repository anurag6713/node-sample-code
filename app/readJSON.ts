import uWebSockets from 'uWebSockets.js';

import type {GenericObject} from 'customTypes';

function readJson(
    res: uWebSockets.HttpResponse,
    cb: (json: GenericObject) => void,
    err: () => void,
): void {
    let buffer: Buffer;
    /* Register data cb */
    res.onData((ab, isLast) => {
        const chunk = Buffer.from(ab);
        if (isLast) {
            let json: GenericObject;
            if (buffer) {
                try {
                    json = JSON.parse(
                        Buffer.concat([buffer, chunk]).toString(),
                    );
                } catch (e) {
                    /* res.close calls onAborted */
                    res.close();
                    return;
                }
                cb(json);
            } else {
                try {
                    json = JSON.parse(chunk.toString() || '{}');
                } catch (e) {
                    /* res.close calls onAborted */
                    res.close();
                    return;
                }
                cb(json);
            }
        } else {
            if (buffer) {
                buffer = Buffer.concat([buffer, chunk]);
            } else {
                buffer = Buffer.concat([chunk]);
            }
        }
    });

    /* Register error cb */
    res.onAborted(err);
}

export default readJson;
