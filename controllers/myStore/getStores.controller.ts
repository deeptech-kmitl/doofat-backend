import { Request, Response } from 'express'
import { getAllStores } from '../../models/store.model'
import { Store, User } from '@prisma/client'

const getStores = async (req: Request, res: Response) => {
    try {
        const user = req.user as User
        const stores = await getAllStores(user.id)

        res.status(200).json(stores)
    } catch (error: any) {
        console.log(error);
        res.status(500).json({ errors: [{ msg: 'Server error' }] })
    }
}

export default getStores