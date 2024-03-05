import { Request, Response } from 'express'
import { newFood } from '../../../models/food.model'
import { PrismaClient, Food } from '@prisma/client'

const prisma = new PrismaClient()

import GoogleStorage from '../../storage/google'

const googleStorage = GoogleStorage.createInstance("doofat_bucket")

async function getNextAutoIncrement() {
    // Get the next auto-increment value for the "id" field of the "record" table
    const nextVal: any = await prisma.$queryRaw`SELECT AUTO_INCREMENT
    FROM information_schema.tables
    WHERE table_name = 'Food'
    AND table_schema = DATABASE( ) ;`

    // Return the next auto-increment value
    return Number(nextVal[0].AUTO_INCREMENT);
}

const createFood = async (req: Request, res: Response) => {
    const storeId = req.params.id
    const menuId = req.params.menuId

    const uploadImg = async (files: any, keyName: string) => {
        if (files[keyName]) {
            // May bug
            const foodId = await getNextAutoIncrement()
            const file = files[keyName][0]
            const url = await googleStorage.uploadFile(file, `store/${storeId}/menu/${menuId}/${foodId}`)
            req.body[keyName] = url
        }
    }

    try {
        await uploadImg(req.files, "img")

        const { name, description, price, img } = req.body
        const food = await newFood({ storeId: storeId, menuId: Number(menuId), name, description, price: Number(price), img } as Food)
        res.status(200).json(food)
    } catch (error: any) {
        console.log(error);
        res.status(500).json({ errors: [{ msg: 'Server error' }] })
    }
}

export default createFood