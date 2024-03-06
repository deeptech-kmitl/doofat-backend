import { Request, Response } from 'express';
import { getUserOrders } from '../../models/order.model';
import { OrderStatus, User } from '@prisma/client';

const getMyOrder = async (req: Request, res: Response) => {

    const validStatus = ['NEW', 'PENDING', 'COMPLETED', 'CANCLED']
    if (req.query.status) {
        const status = String(req.query.status).toUpperCase().split(',')
        const isValid = status.every((s) => validStatus.includes(s))
        if (!isValid) {
            return res.status(400).json({
                errors: [{ msg: 'Invalid status' }],
            })
        }
    }

    try {
        const status = String(req.query.status).toUpperCase().split(',') as OrderStatus[]
        const user = req.user as User
        const orders = await getUserOrders(user.id, status)
        res.status(200).json(orders)
    } catch (error) {
        console.log(error)
        res.status(500).json({
            errors: [{ msg: 'Server error' }],
        })
    }
}

export default getMyOrder