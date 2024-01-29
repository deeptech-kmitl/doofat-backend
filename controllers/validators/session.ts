import { Request, Response, NextFunction } from 'express';

const requireSession = (req: Request, res: Response, next: NextFunction) => {
    if (req.user) {
        next();
    } else {
        res.status(401).json({ errors: [{ msg: 'Unauthorized' }] })
    }
}

export default requireSession;