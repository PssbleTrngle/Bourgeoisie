import { celebrate, Joi } from "celebrate";
import { Request, Router } from "express";
import jwt from 'jsonwebtoken';
import { wrap, wrapAuth } from ".";
import config from '../config';
import BadRequestError from "../error/BadRequestError";
import UnauthorizedError from '../error/UnauthorizedError';
import Server, { Token } from "../models/Server";

const { jwt_secret, expires_in } = config.auth

function decodeJWT(token: string) {
    try {
        return jwt.verify(token, jwt_secret) as Token;
    } catch {
        throw new BadRequestError()
    }
}

export async function authenticate(req: Request) {
    const [type, token] = req.headers.authorization?.split(' ') ?? []

    if (!token) throw new UnauthorizedError('You are not logged in')
    if (type !== 'Token') throw new BadRequestError('Invalid authorization type')

    const { id, generated_at } = decodeJWT(token)

    const now = new Date().getTime();
    if (expires_in !== null && now >= (generated_at + expires_in * 3.6e+6)) throw new BadRequestError('Token expired')

    const server = await Server.findOne(id);
    if (!server) throw new BadRequestError('Server does not longer exist')

    return server;
}

export default () => {
    const router = Router()

    router.head('/', wrapAuth(() => true))

    router.post('/', celebrate({
        body: {
            access_key: Joi.string().required(),
            password: Joi.string().required(),
        }
    }), wrap(async req => {
        const { access_key, password } = req.body;
        return Server.login(access_key, password)
    }))

    router.post('/register', celebrate({
        body: {
            servername: Joi.string().required(),
            password: Joi.string().required(),
        }
    }), wrap(async req => {
        const { password } = req.body;
        return Server.register(password, {});
    }))

    return router;

}