import { Request, Response } from 'express'
import { deleteMenu } from '../../../models/menu.model'
import { Menu } from '@prisma/client'

import GoogleStorage from '../../storage/google'

const googleStorage = GoogleStorage.createInstance("doofat_bucket")

const deleteMN = async (req: Request, res: Response) => {
    try {
        const menu = await deleteMenu({ id: req.params.menuId, storeId: req.params.id })
        googleStorage.deleteDirectory(`store/${menu.storeId}/menu/${menu.id}`)
        res.status(200).json(menu)
    } catch (error: any) {
        console.log(error);
        res.status(500).json({ errors: [{ msg: 'Server error' }] })
    }
}

export default deleteMN