import {defaultSchema} from '@utils/schemas';

import controllers from './controllers';
import middlewares from './middlewares';
import schemas from './schemas';

import type {Routes} from '@customTypes';

const basePath = '/channel/rap/';

const routes: Routes = [
    [
        'POST',
        basePath + 'edit',
        controllers.edit,
        defaultSchema,
        [middlewares.edit()],
    ],
    [
        'GET',
        basePath + 'remove',
        controllers.remove,
        defaultSchema,
        [middlewares.remove()],
    ],
    [
        'GET',
        basePath + 'get-all',
        controllers.getAll,
        schemas.getAll,
        [middlewares.getAll()],
    ],
];

export default routes;
