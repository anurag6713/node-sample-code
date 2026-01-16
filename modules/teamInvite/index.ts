import {privateRoute} from '@middlewares';
import teamSchema from '@modules/team/schemas';
import {createdSchema} from '@utils/schemas';

import controllers from './controllers';
import middlewares from './middlewares';

import type {Routes} from '@customTypes';

const basePath = '/team-invite/';

const routes: Routes = [
    [
        'POST',
        basePath + 'invite',
        controllers.invite,
        createdSchema,
        [privateRoute(), middlewares.invite()],
    ],
    [
        'GET',
        basePath + 'accept',
        controllers.accept,
        teamSchema.get,
        [privateRoute()],
    ],
    [
        'GET',
        basePath + 'decline',
        controllers.decline,
        createdSchema,
        [privateRoute()],
    ],
    [
        'GET',
        basePath + 'read',
        controllers.read,
        createdSchema,
        [privateRoute()],
    ],
];

export default routes;
