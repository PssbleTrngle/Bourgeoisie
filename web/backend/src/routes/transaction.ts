import { celebrate, Joi } from "celebrate";
import { Router } from "express";
import { wrap } from ".";
import BadRequestError from "../error/BadRequestError";
import Transaction, { Status } from "../models/Transaction";
import Wallet from "../models/Wallet";

export default () => {
    const router = Router()

    router.post('/', celebrate({
        body: {
            from: Joi.string().required(),
            to: Joi.string().required(),
            amount: Joi.number().integer().greater(0).required(),
            description: Joi.string().required(),
        }
    }), wrap(async ({ server, body }) => {
        const { description } = body
        const amount = Number.parseInt(body.amount)

        const [from, to] = await Promise.all([body.from, body.to].map(
            idOrName => Wallet.findBy(idOrName, server)
        ))

        if (!from || !to) return null;

        return Transaction.create({ from, to, amount, description }).save()
    }))

    async function operate(id: string, consumer: (t: Transaction) => Status | void) {
        const transaction = await Transaction.findOne(id)
        if (!transaction) return null;

        if (transaction.status !== Status.OPEN) throw new BadRequestError('Transaction already closed')

        const s = consumer(transaction);
        if (s) transaction.status = s;

        return transaction.save();
    }

    router.delete('/:id/fullfil', celebrate({
        params: {
            id: Joi.number().required(),
        },
        body: {
            by: Joi.string().required(),
        }
    }), wrap(async req => operate(req.params.id, ({ from, to, amount }) => {
        if (from.cash < amount) throw new BadRequestError('Not enough cash')
        if (req.body.by !== from.owner) throw new BadRequestError('Only the debtor can fulfill a transaction')
        from.cash -= amount;
        to.cash += amount;
        return Status.FULLFILLED
    })))

    router.delete('/:id/decline', celebrate({
        params: {
            id: Joi.number().required(),
        },
        body: {
            by: Joi.string().required(),
        }
    }), wrap(async req => operate(req.params.id, ({ from, to }) => {
        const { by } = req.body;
        if (by !== from.owner && by !== to.owner) throw new BadRequestError('You are not part of this transaction')
        return Status.DECLINED
    })))

    return router;

}