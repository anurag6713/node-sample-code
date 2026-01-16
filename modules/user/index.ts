import {privateRoute} from '@middlewares';

import controllers from './controllers';

import type {Routes} from '@customTypes';

const basePath = '/user/';

const routes: Routes = [
    ['GET', basePath + 'login', controllers.login],
    ['GET', basePath + 'login-success', controllers.loginSuccess],
    ['GET', basePath + 'me', controllers.me, undefined, [privateRoute()]],
    ['GET', basePath + 'temp-login', controllers.tempLogin], // @todo -> Remove later
];

export default routes;
