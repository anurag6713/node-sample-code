import type {Middleware} from './request';
import type {Controller, Schema} from './utils';

export type Route = [
    'GET' | 'POST',
    string,
    Controller,
    Schema?,
    Middleware[]?,
];

export type Routes = Route[];

export interface AllRoutes {
    POST: {
        [key: string]: [Controller, Schema, Middleware[]];
    };
    GET: {
        [key: string]: [Controller, Schema, Middleware[]];
    };
}
