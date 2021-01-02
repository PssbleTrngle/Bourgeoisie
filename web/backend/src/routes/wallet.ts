import { celebrate, Joi } from "celebrate";
import { Router } from "express";
import { wrap, wrapAuth } from ".";
import BadRequestError from "../error/BadRequestError";
import Wallet from "../models/Wallet";

export default () => {
    const router = Router()

    router.post('/', celebrate({
        body: {
            owner: Joi.string().required(),
            name: Joi.string().required(),
        }
    }), wrapAuth(async ({ server, body }) => {
        const { owner, name } = body;

        const { wallets_per_player, starting_cash } = await server.getSettings();
        const existing = await Wallet.count({ server, owner })

        if (existing >= wallets_per_player) throw new BadRequestError('Maximum wallets for user')
        if (!isNaN(Number.parseInt(name))) throw new BadRequestError('Invalid wallet name')

        return Wallet.create({ server, owner, name, cash: starting_cash }).save()
    }))

    router.get('/:idOrName', celebrate({
        params: {
            idOrName: Joi.number().required()
        }
    }), wrap(async req => {
        const { idOrName } = req.params
        return Wallet.findBy(idOrName, req.server)
    }))

    enum Operation {
        SET = 'set',
        ADD = 'add',
        REMOVE = 'remove',
    }

    router.put('/:idOrName', celebrate({
        params: {
            idOrName: Joi.number().required()
        },
        body: {
            amount: Joi.number().integer().positive().required(),
            operation: Joi.string().required().valid(...Object.values(Operation)),
        }
    }), wrapAuth(async req => {
        const { idOrName } = req.params
        const { operation, amount } = req.body;
        const wallet = await Wallet.findBy(idOrName, req.server)
        if (wallet) {
            switch (operation as Operation) {
                case Operation.SET: wallet.cash = amount; break;
                case Operation.ADD: wallet.cash += amount; break;
                case Operation.REMOVE: wallet.cash -= amount; break;
            }
            if (wallet.cash <= 0) throw new BadRequestError('Not enough cash for operation')
            else await wallet?.save();
        }
        return wallet;
    }))

    router.get('/', celebrate({
        query: {
            owner: Joi.string(),
            name: Joi.string(),
        }
    }), wrapAuth(async ({ server, query }) => {
        const owner = query.owner?.toString()
        const name = query.name?.toString()
        return Wallet.find({ server, owner, name })
    }))

    return router;

}