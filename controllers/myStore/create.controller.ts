import { Request, Response } from 'express'
import { newStore } from '../../models/store.model'
import { Store, User } from '@prisma/client'

const create = async (req: Request, res: Response) => {
    try {
        const user = req.user as User
        const { name, description } = req.body
        const store = await newStore({ userId: user.id, name, description } as Store)

        res.status(200).json(store)
    } catch (error: any) {
        console.log(error);
        res.status(500).json({ errors: [{ msg: 'Server error' }] })
    }
}

export default create