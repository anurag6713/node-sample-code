import {privateRoute} from '@middlewares';
import {createdSchema} from '@utils/schemas';

import controllers from './controllers';
import middlewares from './middlewares';
import schemas from './schemas';

import type {Routes} from '@customTypes';

const basePath = '/team-member/';

const routes: Routes = [
    [
        'POST',
        basePath + 'members',
        controllers.getMembers,
        schemas.getMembers,
        [privateRoute(), middlewares.getMembers()],
    ],
    [
        'GET',
        basePath + 'leave',
        controllers.leaveTeam,
        createdSchema,
        [privateRoute(), middlewares.isMember()],
    ],
];

export default routes;
