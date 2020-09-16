import * as express from 'express';

export interface ApiController {
    path: string;
    router: express.Router
    childComponents: ApiController[]
    intializeRoutes():void
}

