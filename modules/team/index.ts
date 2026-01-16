import {privateRoute} from '@middlewares';

import controllers from './controllers';
import middlewares from './middlewares';
import schemas from './schemas';

import type {Routes} from '@customTypes';

const basePath = '/team/';

const routes: Routes = [
    [
        'POST',
        basePath + 'create',
        controllers.create,
        schemas.get,
        [privateRoute(), middlewares.create()],
    ],
];

export default routes;
