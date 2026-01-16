import controllers from './controllers';
import schemas from './schemas';

import type {Routes} from '@customTypes';

const routes: Routes = [
    ['POST', '/user-token/get', controllers.get, schemas.get],
];

export default routes;
