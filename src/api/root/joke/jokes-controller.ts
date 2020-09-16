import * as express from 'express';
import { ApiController } from '../../../types/ApiController';
import { responseJson } from '../../../util/response';
import { JokeService } from '../../../services/JokeService';
import { logError } from '../../../util/logging';

export class JokesController implements ApiController{
    public path: string= '/jokes/';
    public router: express.Router = express.Router();
    public childComponents: ApiController[] = [];
    public jokesrv: JokeService;
    constructor() {
        this.intializeRoutes();
        this.jokesrv = new JokeService();
    }

    public intializeRoutes() {
        this.router.get(`/getRand`,this.getRandJoke)
        this.childComponents.forEach( el  => {
            this.router.use(el.path, el.router)
        })
        // 404 Error Response
        this.router.use((req, res, next) => {
            responseJson(req,res,404,{},"api request not found");
        });
    }

    public getRandJoke(req: express.Request, res: express.Response){
        const jokesrv = new JokeService();
        jokesrv.getRandomJoke().then( resp => {
            responseJson(req,res,200, resp);
        }).catch( err => {
            logError(err)
            responseJson(req,res,500,{},"internal error");
        })
    }

}

