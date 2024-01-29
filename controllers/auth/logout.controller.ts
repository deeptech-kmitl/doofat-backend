import { Request, Response, NextFunction } from 'express';

const logout = (req: Request, res: Response, next: NextFunction) => {
    req.logout(function (err) {
        if (err) { return next(err); }

        req.session.destroy((err) => {
            if (err) { return next(err); }
        })

        res.send({ msg: 'Logged out' });
    });
}

export default logout;