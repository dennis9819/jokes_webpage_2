import express from 'express';
import * as bodyParser from 'body-parser';
import { logInfo, logError } from "../util/logging";
import { ApiController } from '../types/ApiController';
import { responseJson } from '../util/response';
import * as rfs from 'rotating-file-stream'
import morgan from 'morgan'

export class WebAPI {
    public app: express.Application;
    public port: number;
    public accessLogStream: rfs.RotatingFileStream;

    constructor(port: number) {
        this.app = express();
        this.port = port;
        this.accessLogStream = rfs.createStream('access.log', {
            interval: '1d', // rotate daily
            path: './log'
        });
        this.initializeMiddlewares();
    }

    private initializeMiddlewares() {
        this.app.use(morgan('combined', {
            stream: this.accessLogStream
        }))
        this.app.use(bodyParser.json());
    }

    public initializeControllers(controllers: ApiController[]) {
        controllers.forEach(el => {
            this.app.use(el.path, el.router);
        })
        // JSON parse error
        this.app.use((err: Error, req: express.Request, res: express.Response, next: any) => {
            if (err instanceof SyntaxError) {
                responseJson(req,res,400,{},"JSON invalid");
            } else {
                logError(`Express: ${err.message}`);
                responseJson(req,res,500,{},"Internal error");
            }
        })
    }

    public listen() {
        this.app.listen(this.port, () => {
            logInfo(`App listening on the port ${this.port}`);
        });
    }
}