import { Request, Response } from 'express'
import { User, Store } from '@prisma/client'
import GoogleStorage from '../storage/google'
import { editUser } from '../../models/users.model'
import bcrypt from 'bcrypt'

const googleStorage = GoogleStorage.createInstance("doofat_bucket")

const updateUser = async (req: Request, res: Response) => {
    // const id = req.params.id
    const user = req.user as User

    const uploadImg = async (files: any, keyName: string) => {
        if (files[keyName]) {
            const file = files[keyName][0]
            const url = await googleStorage.uploadFile(file, `user/${user.id}/${keyName}`)
            req.body[keyName] = url
        }
    }

    try {
        const files = Object(req.files)
        await uploadImg(files, "avatar")

        const { name, email, password, avatar } = req.body

        let hashedPassword = password
        if (password) {
            hashedPassword = await bcrypt.hash(password, 10)
        }

        const updateUser = await editUser(user.id, { name, email, password: hashedPassword, avatar } as User)

        return res.status(200).json({ user: updateUser })
    } catch (error: any) {
        console.log(error);
        return res.status(500).json({ errors: [{ msg: 'Server error' }] })
    }
}

export default updateUser