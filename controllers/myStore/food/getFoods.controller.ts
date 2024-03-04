import { Request, Response } from 'express'
import { getFoodsByMenu } from '../../../models/food.model'

const getFoods = async (req: Request, res: Response) => {
    try {
        const foods = await getFoodsByMenu(req.params.menuId)

        res.status(200).json(foods)
    } catch (error: any) {
        console.log(error);
        res.status(500).json({ errors: [{ msg: 'Server error' }] })
    }
}

export default getFoods
