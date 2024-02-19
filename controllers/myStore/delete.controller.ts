import { Request, Response } from 'express'
import { delStore } from '../../models/store.model'
import { Store, User } from '@prisma/client'
import GoogleStorage from '../storage/google'

const googleStorage = GoogleStorage.createInstance("doofat_bucket")

const deleteStore = async (req: Request, res: Response) => {
    const id = req.params.id
    try {
        googleStorage.deleteDirectory(`store/${id}`)

        const user = req.user as User
        const store = await delStore({ id, userId: user.id })

        res.status(200).json(store)
    } catch (error: any) {
        if (error.message.split(". ").pop() === 'Record to update not found.') {
            return res.status(404).json({ errors: [{ msg: 'Store not found' }] })
        }
        console.log(error);
        res.status(500).json({ errors: [{ msg: 'Server error' }] })
    }
}

export default deleteStore