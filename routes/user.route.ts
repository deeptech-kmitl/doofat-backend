import { Router, Request, Response } from 'express'
import { validate, body } from '../controllers/validators/bodyValidate'
import requireSession from '../controllers/validators/session'
import { updateUser } from '../controllers/user'
import multer from '../controllers/storage/multer'

const router = Router()
const userFileMiddleware = multer.fields([{ name: 'avatar', maxCount: 1 }])

router.patch('/', requireSession, userFileMiddleware, body('name').not().isEmpty(), body('email').isEmail(), body('password').isLength({ min: 6 }).optional(), validate, updateUser)

module.exports = router