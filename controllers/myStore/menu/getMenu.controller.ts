import { Request, Response } from 'express'
import { getOneMenu } from '../../../models/menu.model'
// import { Store, User } from '@prisma/client'

const getMenu = async (req: Request, res: Response) => {
    try {
        const menu = await getOneMenu({ id: req.params.menuId, storeId: req.params.id })

        res.status(200).json(menu)
    } catch (error: any) {
        console.log(error);
        res.status(500).json({ errors: [{ msg: 'Server error' }] })
    }
}

export default getMenu