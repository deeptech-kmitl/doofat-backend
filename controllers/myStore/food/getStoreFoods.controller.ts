import { Request, Response } from 'express'
import { getFoodByStore } from '../../../models/food.model'

const getStoreFood = async (req: Request, res: Response) => {
    try {
        const foods = await getFoodByStore(req.params.id)

        res.status(200).json(foods)
    } catch (error: any) {
        console.log(error);
        res.status(500).json({ errors: [{ msg: 'Server error' }] })
    }
}

export default getStoreFood