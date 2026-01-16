import {privateRoute} from '@middlewares';
import {createdSchema, defaultSchema} from '@utils/schemas';

import controllers from './controllers';
import middlewares from './middlewares';
import schemas from './schemas';

import type {Routes} from '@customTypes';

const basePath = '/team/rap/';

const routes: Routes = [
    [
        'POST',
        basePath + 'create',
        controllers.create,
        createdSchema,
        [privateRoute(), middlewares.create()],
    ],
    [
        'POST',
        basePath + 'edit',
        controllers.edit,
        defaultSchema,
        [privateRoute(), middlewares.create(), middlewares.edit()],
    ],
    [
        'GET',
        basePath + 'remove',
        controllers.remove,
        defaultSchema,
        [privateRoute(), middlewares.remove()],
    ],
    [
        'GET',
        basePath + 'get-all',
        controllers.getAll,
        schemas.getAll,
        [privateRoute(), middlewares.getAll()],
    ],
];

export default routes;
