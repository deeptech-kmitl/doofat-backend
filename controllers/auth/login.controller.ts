import { Request, Response } from 'express'
import passport from '../passport'
// import jwt from 'jsonwebtoken'

const login = async (req: Request, res: Response, next: Function) => passport.authenticate(
    'local',
    { session: true },
    (err: any, user: any, info: any) => {

        try {
            if (err || !user) {
                return res.status(400).json({ errors: [{ msg: info.message || 'Server error' }] })
            }

            req.login(user, { session: true }, (err: any) => {
                if (err) {
                    return res.status(400).json({ errors: [{ msg: 'Server error' }] })
                }

                const { password, ...userWithoutPassword } = user
                return res.json({ user: userWithoutPassword })
                // const token = jwt.sign({ id: user.id }, process.env.SECRET_KEY || '', {
                //     expiresIn: '7d',
                // })
                // return res
                //     .header('authorization', token)
                //     .json({ user: userWithoutPassword, access_token: token })
            })

        } catch (error) {
            console.log(error);
            res.status(500).json({ errors: [{ msg: 'Server error' }] })
        }

    }
)(req, res, next)

export default login