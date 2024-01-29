import bcrypt from 'bcrypt'
import { Request, Response } from 'express'
import { newUser } from "../../models/users.model"


const register = async (req: Request, res: Response) => {
    try {
        const { name, email, password } = req.body
        const hashedPassword = await bcrypt.hash(password, 10)
        const resgister = await newUser({ name, email, password: hashedPassword } as any)
        res.json(resgister)
    } catch (error: any) {
        // email already exists
        if (error.code === 'P2002') {
            return res.status(400).json({ errors: [{ msg: 'Email already exists' }] })
        }
        console.log(error);
        res.status(500).json({ errors: [{ msg: 'Server error' }] })
    }
}

export default register