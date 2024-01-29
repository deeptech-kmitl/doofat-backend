import { Request, Response } from 'express'
import passport from '../passport'

const facebook = passport.authenticate('facebook', {
    successRedirect: '/',
    failureRedirect: '/login',
    scope: ['email']
})

const facebookCallback = (req: Request, res: Response, next: Function) => passport.authenticate(
    'facebook', { failureRedirect: '/login', failureMessage: true },
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
            })

        } catch (error) {
            console.log(error);
            res.status(500).json({ errors: [{ msg: 'Server error' }] })
        }
    })(req, res, next)

export default { facebook, facebookCallback }