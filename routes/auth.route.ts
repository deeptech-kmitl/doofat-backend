import { Router, Request, Response } from 'express'
import { validate, body } from '../controllers/validators/bodyValidate'
import { register, login, logout, google, facebook } from '../controllers/auth'
import requireSession from '../controllers/validators/session'

const router = Router()

router.get('/user', requireSession, (req: Request, res: Response) => {
    res.send({ user: req.user });
})

router.post('/login', body('email').not().isEmpty(), body('password').not().isEmpty(), validate, login)

router.post('/register', body('name').not().isEmpty(), body('email').isEmail(), body('password').isLength({ min: 6 }), validate, register)

router.post('/logout', logout)

router.get('/session', (req: Request, res: Response) => {
    res.send(req.sessionStore);
})

router.get('/google', google.google)

router.post('/googleCallback', google.googleCallback);

router.get('/facebook', facebook.facebook)

router.post('/facebookCallback', facebook.facebookCallback);

module.exports = router
