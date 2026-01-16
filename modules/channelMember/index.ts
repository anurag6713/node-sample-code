import {privateRoute} from '@middlewares';
import channelSchemas from '@modules/channel/schemas';
import {createdSchema} from '@utils/schemas';

import controllers from './controllers';
import middlewares from './middlewares';
import schemas from './schemas';

import type {Routes} from '@customTypes';

const basePath = '/channel-member/';

const routes: Routes = [
    [
        'POST',
        basePath + 'add',
        controllers.addMembers,
        schemas.addMembers,
        [privateRoute(), middlewares.addMembers()],
    ],
    [
        'GET',
        basePath + 'join',
        controllers.joinPublicChannel,
        channelSchemas.get,
        [privateRoute(), middlewares.joinPublicChannel()],
    ],
    [
        'GET',
        basePath + 'leave',
        controllers.leaveChannel,
        createdSchema,
        [privateRoute(), middlewares.isMember()],
    ],
    [
        'GET',
        basePath + 'public-channels',
        controllers.getUnjoinedPublicChannels,
        channelSchemas.getAll,
        [privateRoute(), middlewares.getUnjoinedPublicChannels()],
    ],
];

export default routes;
