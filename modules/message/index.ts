import {privateRoute} from '@middlewares';
import {defaultSchema} from '@utils/schemas';

import controllers from './controllers';
import middlewares from './middlewares';
import schemas from './schemas';

import type {Routes} from '@customTypes';

const basePath = '/message/';

const routes: Routes = [
    [
        'GET',
        basePath + 'delete-message',
        controllers.deleteMessage,
        defaultSchema,
        [privateRoute(), middlewares.deleteMessage()],
    ],
    [
        'POST',
        basePath + 'edit-message',
        controllers.editMessage,
        schemas.message,
        [privateRoute(), middlewares.editMessage()],
    ],
    [
        'GET',
        basePath + 'get-messages',
        controllers.getMessages,
        schemas.getMessages,
        [privateRoute(), middlewares.getMessages()],
    ],
    [
        'POST',
        basePath + 'new-message',
        controllers.newMessage,
        schemas.newMessage,
        [privateRoute(), middlewares.newMessage()],
    ],
];

export default routes;
