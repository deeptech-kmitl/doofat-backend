import { Request, Response } from 'express'
import { User, Order, Prisma } from '@prisma/client'
import { findFoodByManyId } from '../../models/food.model'
import { newOrder } from '../../models/order.model'
import { getStoreOrders } from '../../models/order.model'
import Socket from '../socket/socket';
const create = async (req: Request, res: Response) => {
    try {
        const user = req.user as User
        const { foods } = req.body
        const ids: any = []
        let tempTotal = 0
        const total = foods.reduce((acc: number, curr: any) => {
            ids.push(curr.id)
            tempTotal += curr.price
            return acc + curr.price * curr.amount
        }, 0)

        const checkFood = await findFoodByManyId({ ids, storeId: req.params.storeId })

        if (checkFood.length !== foods.length) {
            return res.status(400).json({ errors: [{ msg: 'This food is not in store' }] })
        }

        if (tempTotal != checkFood.reduce((acc: number, curr: any) => acc + curr.price, 0)) {
            return res.status(400).json({ errors: [{ msg: 'Price of food is not correct' }] })
        }

        const order = await newOrder({ userId: user.id, storeId: req.params.storeId, foods: foods as Prisma.JsonArray, total } as Order)

        res.status(200).json(order)

        const io = Socket.getInstance()
        io.emit(`order/mystore/${req.params.storeId}`, await getStoreOrders(req.params.storeId, ['NEW', 'PENDING']));
    } catch (error: any) {
        console.log(error);

        res.status(500).json({ errors: [{ msg: 'Server error' }] })
    }
}

export default create