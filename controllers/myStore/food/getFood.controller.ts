import { Request, Response } from 'express'
import { getOneFood } from '../../../models/food.model'

const getFood = async (req: Request, res: Response) => {
    try {
        const food = await getOneFood({ id: req.params.foodId, storeId: req.params.id })

        res.status(200).json(food)
    } catch (error: any) {
        console.log(error);
        res.status(500).json({ errors: [{ msg: 'Server error' }] })
    }
}

export default getFood