import { Request, Response } from 'express'
import { getAllMenus } from '../../../models/menu.model'
// import { Store, User } from '@prisma/client'

const getMenus = async (req: Request, res: Response) => {
    try {
        const menus = await getAllMenus(req.params.id)

        res.status(200).json(menus)
    } catch (error: any) {
        console.log(error);
        res.status(500).json({ errors: [{ msg: 'Server error' }] })
    }
}

export default getMenus