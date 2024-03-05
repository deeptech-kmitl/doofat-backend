import { Request, Response } from 'express'
import { newMenu } from '../../../models/menu.model'
import { Menu } from '@prisma/client'

const create = async (req: Request, res: Response) => {
    try {
        const { name, description } = req.body
        const menu = await newMenu({ storeId: req.params.id, name, description } as Menu)

        res.status(200).json(menu)
    } catch (error: any) {
        console.log(error);
        res.status(500).json({ errors: [{ msg: 'Server error' }] })
    }
}

export default create