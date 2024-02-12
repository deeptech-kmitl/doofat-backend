import { Request, Response } from 'express'
import { updateStore } from '../../models/store.model'
import { Store, User } from '@prisma/client'
import GoogleStorage from '../storage/google'

const googleStorage = GoogleStorage.createInstance("doofat_bucket")

const edit = async (req: Request, res: Response) => {
    const id = req.params.id

    const uploadImg = async (files: any, keyName: string) => {
        if (files[keyName]) {
            const file = files[keyName][0]
            const url = await googleStorage.uploadFile(file, `store/${id}/${keyName}`)
            req.body[keyName] = url
        }
    }

    try {
        const files = Object(req.files)
        await uploadImg(files, "logoImg")
        await uploadImg(files, "bgImg")

        const user = req.user as User
        const { name, description, logoImg, bgImg, location, range } = req.body
        const store = await updateStore({ id, userId: user.id }, { name, description, logoImg, bgImg, location, range: range !== '0' ? Number(range) || range : 0 } as Store)

        res.status(200).json(store)
    } catch (error: any) {
        if (error.message.split(". ").pop() === 'Record to update not found.') {
            return res.status(404).json({ errors: [{ msg: 'Store not found' }] })
        }
        console.log(error);
        res.status(500).json({ errors: [{ msg: 'Server error' }] })
    }
}

export default edit