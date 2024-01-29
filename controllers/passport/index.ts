import passport from 'passport'
import local from './local'
import google from './google'
import facebook from './facebook'
import { User } from '@prisma/client';
import { getUser } from '../../models/users.model';

passport.use(local)
passport.use(google)
passport.use(facebook)

passport.serializeUser((data, cb) => {
    process.nextTick(() => {
        const user: User = data as User;
        cb(null, user.id);
    });
});

passport.deserializeUser(async (user: User, cb) => {
    try {
        const userData = await getUser(user);
        const { password, ...userWithoutPassword } = userData as User;
        process.nextTick(function () {
            return cb(null, userWithoutPassword);
        });
    } catch (error) {
        return cb(error, null);
    }
});

export default passport