import * as express from 'express';
import { ApiController } from '../../types/ApiController';
import { responseJson } from '../../util/response';
import { JokeController } from './joke/joke-controller';
import { JokesController } from './joke/jokes-controller';

export class RootController implements ApiController{
    public path: string= '/';
    public router: express.Router = express.Router();
    public childComponents: ApiController[] = [
        new JokeController(),
        new JokesController(),
    ];

    constructor() {
        this.intializeRoutes();
    }

    public intializeRoutes() {
        this.router.use(express.static('./static'));
        this.childComponents.forEach( el  => {
            this.router.use(el.path, el.router)
        })
        // 404 Error Response
        this.router.use((req, res, next) => {
            responseJson(req,res,404,{},"api request not found");
        });
    }
}

