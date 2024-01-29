import { Request, Response } from 'express'
import { validationResult, body, check } from 'express-validator'

const validate = (req: Request, res: Response, next: any) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
}

export { validate, body, check }