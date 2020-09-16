import * as express from 'express';
import { ApiController } from '../../../types/ApiController';
import { responseJson } from '../../../util/response';
import { JokeService } from '../../../services/JokeService';
import { logError } from '../../../util/logging';

export class JokeController implements ApiController{
    public path: string= '/joke/';
    public router: express.Router = express.Router();
    public childComponents: ApiController[] = [];
    constructor() {
        this.intializeRoutes();
    }

    public intializeRoutes() {
        this.router.get(`/:id`,this.getSingle)
        this.router.get(`/:id/upvote`,this.upvote)
        this.router.get(`/:id/downvote`,this.upvote)
        this.childComponents.forEach( el  => {
            this.router.use(el.path, el.router)
        })
        // 404 Error Response
        this.router.use((req, res, next) => {
            responseJson(req,res,404,{},"api request not found");
        });
    }

    public upvote(req: express.Request, res: express.Response){
        const js = new JokeService();
        const id = req.params.id as unknown as string;
        if (!(id.match(/^[0-9]*$/))){
            responseJson(req,res,400,{},"invalid id");
        }else{
            js.upvote(Number(id));
            js.getRandomJoke().then( resp => {
                responseJson(req,res,200, resp);
            }).catch( err => {
                if (err.message === "No Joke found"){
                    responseJson(req,res,404,{},"Not found");
                    return
                }
                logError(err)
                responseJson(req,res,500,{},"internal error");
            })
        }
    }

    public downvote(req: express.Request, res: express.Response){
        const js = new JokeService();
        const id = req.params.id as unknown as string;
        if (!(id.match(/^[0-9]*$/))){
            responseJson(req,res,400,{},"invalid id");
        }else{
            js.downvote(Number(id));
            js.getRandomJoke().then( resp => {
                responseJson(req,res,200, resp);
            }).catch( err => {
                if (err.message === "No Joke found"){
                    responseJson(req,res,404,{},"Not found");
                    return
                }
                logError(err)
                responseJson(req,res,500,{},"internal error");
            })
        }
    }

    public getSingle(req: express.Request, res: express.Response){
        const js = new JokeService();
        const id = req.params.id as unknown as string;
        if (!(id.match(/^[0-9]*$/))){
            responseJson(req,res,400,{},"invalid id");
        }else{
            js.getJoke(Number(id)).then( resp => {
                responseJson(req,res,200, resp);
            }).catch( err => {
                if (err.message === "No Joke found"){
                    responseJson(req,res,404,{},"Not found");
                    return
                }
                logError(err)
                responseJson(req,res,500,{},"internal error");
            })
        }
    }

}

