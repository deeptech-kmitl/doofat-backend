import { Request, Response } from 'express';
import { OrderStatus, User } from '@prisma/client';
import { updateOneOrder, getStoreOrders } from '../../models/order.model';
import Socket from '../socket/socket';
const updateOrder = async (req: Request, res: Response) => {
    try {
        const { status } = req.body
        const updateOrder = await updateOneOrder(Number(req.params.id), { status: status.toUpperCase() } as any)

        res.status(200).json(updateOrder)

        // if update code then request this route again program will be crash
        const io = Socket.getInstance()
        io.emit(`order/${updateOrder.id}`, updateOrder);
        io.emit(`order/store/${updateOrder.storeId}`, await getStoreOrders(updateOrder.storeId, ['PENDING']));
        io.emit(`order/mystore/${updateOrder.storeId}`, await getStoreOrders(updateOrder.storeId, ['NEW', 'PENDING']));
        return
    } catch (error) {
        console.log(error)
        res.status(500).json({
            errors: [{ msg: 'Server error' }],
        })
    }
}

export default updateOrder