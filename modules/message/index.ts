import {privateRoute} from '@middlewares';
import {defaultSchema} from '@utils/schemas';

import controllers from './controllers';
import middlewares from './middlewares';
import schemas from './schemas';

import type {Routes} from '@customTypes';

const basePath = '/message/';

const routes: Routes = [
    [
        'GET',                                       // @METHOD
        basePath + 'get-messages',                   // @PATH
        controllers.getMessages,                     // @CONTROLLER
        schemas.getMessages,                         // @RESPONSE SCHEMA
        [privateRoute(), middlewares.getMessages()], // @MIDDLEWARES
    ],
];

export default routes;
