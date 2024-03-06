import { Request, Response } from 'express'
import { updateFood } from '../../../models/food.model'
import { Food } from '@prisma/client'

import GoogleStorage from '../../storage/google'

const googleStorage = GoogleStorage.createInstance("doofat_bucket")

const editFood = async (req: Request, res: Response) => {

    const storeId = req.params.id
    const foodId = req.params.foodId
    const menuId = req.params.menuId

    const uploadImg = async (files: any, keyName: string) => {
        if (files[keyName]) {
            const file = files[keyName][0]
            const url = await googleStorage.uploadFile(file, `store/${storeId}/menu/${menuId}/${foodId}`)
            req.body[keyName] = url
        }
    }

    try {
        const files = Object(req.files)
        await uploadImg(files, "img")

        const { name, description, price, img } = req.body
        const food = await updateFood({ id: foodId, storeId: storeId }, { name, description, price: Number(price) || price, img } as Food)

        res.status(200).json(food)
    } catch (error: any) {
        console.log(error);
        res.status(500).json({ errors: [{ msg: 'Server error' }] })
    }
}

export default editFood