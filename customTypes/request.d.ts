import type {JWTData} from './models/userToken';
import type {Response} from './response';
import type {GenericObject} from './utils';
import type uWebSockets from 'uWebSockets.js';

export default interface Request {
    url: string;
    body?: GenericObject;
    method?: string;
    headers?: {
        authorization?: string;
    };
    query: string;
}

export type InternalData = JWTData & {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [key: string]: any;
};

export type Middleware = (
    body: GenericObject,
    queryParams?: GenericObject,
    iData?: InternalData,
    request?: Request,
    response?: uWebSockets.HttpResponse,
) => Promise<true | Response | void>;
