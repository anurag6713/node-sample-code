import uWebSockets from 'uWebSockets.js';

import close from './close';
import message from './message';
import open from './open';
import upgrade from './upgrade';

const wsBehavior: uWebSockets.WebSocketBehavior = {
    close,
    message,
    open,
    upgrade,
};

export default wsBehavior;
