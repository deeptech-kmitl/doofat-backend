import { Request, Response } from 'express'
import { updateMenu } from '../../../models/menu.model'
import { Menu } from '@prisma/client'

const edit = async (req: Request, res: Response) => {
    try {
        const { name, description } = req.body
        const menu = await updateMenu({ id: req.params.menuId, storeId: req.params.id }, { name, description } as Menu)

        res.status(200).json(menu)
    } catch (error: any) {
        console.log(error);
        res.status(500).json({ errors: [{ msg: 'Server error' }] })
    }
}

export default edit