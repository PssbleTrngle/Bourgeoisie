import bodyParser from 'body-parser';
import { isCelebrateError } from 'celebrate';
import cors from 'cors';
import { Application, NextFunction, Request as R, Response, Router } from "express";
import { BaseEntity } from 'typeorm';
import config from '../config';
import { stripHidden } from '../decorators/Hidden';
import BadRequestError from '../error/BadRequestError';
import HttpError from '../error/HttpError';
import NotFoundError from '../error/NotFoundError';
import UnauthorizedError from '../error/UnauthorizedError';
import Server from '../models/Server';
import auth, { authenticate } from "./auth";
import wallet from './wallet';

interface Request extends R {
    server?: Server
    authError?: Error
}

interface AuthRequest extends Request {
    server: Server
}
type Func<R extends Request> = (req: R, res: Response, next: NextFunction) => any;

export function wrap(func: Func<Request>): Func<Request> {
    return async (req, res, next) => {
        try {
            try {
                req.server = await authenticate(req)
            } catch (e) {
                req.authError = e
            }

            const response = await func(req, res, next)

            if (response === null || response === undefined) throw new NotFoundError();
            else if (response === true) res.status(200).send();
            else if (response) res.send(
                response instanceof BaseEntity
                    ? stripHidden(response)
                    : response
            );

        } catch (e) {
            next(e);
        }
    }
}

export function wrapAuth(func: Func<AuthRequest>) {
    return wrap(async (req: Request, res, next) => {
        if (req.authError) throw req.authError;
        if (!req.server) throw new UnauthorizedError()
        return func(req as AuthRequest, res, next);
    }) as Func<Request>
}

export default (app: Application) => {

    if (config.api.logging) app.use((req, _, next) => {
        console.log(`[${req.method.toUpperCase()}] -> ${req.path}`)
        next();
    })

    app.use(cors());
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: true }));

    const router = Router()
    app.use(`/${config.api.extension}`, router)

    router.head('/status', (_, res) => {
        res.status(200).end();
    });

    router.get('/status', (_, res) => {
        res.status(200).end();
    });

    router.use('/auth', auth())
    router.use('/wallet', wallet())

    app.use((err: HttpError, _req: Request, _res: Response, next: NextFunction) => {
        if (isCelebrateError(err)) {
            const message = [...err.details.values()]
                .map(e => e.message)
                .join('\n')

            next(new BadRequestError(message))
        } else next(err)
    })

    app.use((err: HttpError, _req: Request, res: Response, _next: NextFunction) => {
        if (process.env.NODE_ENV === 'development') console.error(err);

        res.status(err.statusCode ?? 500);
        res.json({
            error: {
                message: err.message,
            },
        });
        if (config.api.crashOnError) throw err;
    });

}