import * as express from 'express';

export function responseJson(req: express.Request, res: express.Response,code: number, data: any, err?: string): void{
    const respObj: any = {
        rescource: req.originalUrl.toString(),
        success: err ? false : true,
        data,
        debug: {
            host: req.get('host'),
            proto: req.protocol
        },
        error: err ? err : undefined
    }
    res.status(code);
    res.json(respObj);
}