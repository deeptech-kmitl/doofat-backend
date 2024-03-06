import { Request, Response } from 'express'
import { deleteFood } from '../../../models/food.model'

import GoogleStorage from '../../storage/google'

const googleStorage = GoogleStorage.createInstance("doofat_bucket")

const deleteF = async (req: Request, res: Response) => {
    try {
        const food = await deleteFood({ id: req.params.foodId, storeId: req.params.id })
        googleStorage.deleteDirectory(`store/${food.storeId}/menu/${food.menuId}/${food.id}`)
        res.status(200).json(food)
    } catch (error: any) {
        console.log(error);
        res.status(500).json({ errors: [{ msg: 'Server error' }] })
    }
}

export default deleteF