import { Strategy as LocalStrategy } from 'passport-local'
import { getUserByEmail } from "../../models/users.model"
import bcrypt from 'bcrypt'


const local = new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
}, async (email, password, cb) => {
    try {
        const user = await getUserByEmail(email)
        if (!user) {
            return cb(null, false, { message: 'Incorrect email or password.' });
        }

        const isMatch = await bcrypt.compare(password, user.password)
        if (!isMatch) {
            return cb(null, false, { message: 'Incorrect email or password.' });
        }

        return cb(null, user, { message: 'success' });
    } catch (error: any) {
        return cb(null, false, { message: 'Server error' });
    }
});

export default local
