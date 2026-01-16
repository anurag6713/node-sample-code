import {privateRoute} from '@middlewares';

import controllers from './controllers';

import type {Routes} from '@customTypes';

const routes: Routes = [
    ['GET', 'init', controllers.init, undefined, [privateRoute()]],
];

export default routes;
