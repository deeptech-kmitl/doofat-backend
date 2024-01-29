import { Strategy as FacebookStrategy } from 'passport-facebook'
import { getUserByEmail, newUser, updateFacebookId } from "../../models/users.model"

const facebook = new FacebookStrategy({
    clientID: process.env.FACEBOOK_CLIENT_ID || "",
    clientSecret: process.env.FACEBOOK_CLIENT_SECRET || "",
    callbackURL: '/callback/facebook',
    profileFields: ['id', 'displayName', 'photos', 'email']
}, async (accessToken, refreshToken, profile, cb) => {
    const id = profile.id;
    const email = profile.emails?.[0].value || null;
    const name = profile.displayName;
    const avatar = profile.photos?.[0].value || null;

    // no permission to access email
    if (!email)
        return cb(null, false, { message: "no permission to access email" });

    try {
        const user = await getUserByEmail(email)

        if (user) {
            if (user.facebookId !== id) {
                // update facebookId to link account
                const updatedUser = await updateFacebookId(user.id, id)
                return cb(null, { ...updatedUser, accessToken }, { message: 'success' });
            }
            return cb(null, { ...user, accessToken }, { message: 'success' });
        } else {
            // create new user
            const userData = {
                name,
                email,
                avatar,
                facebookId: id,
            }
            const newUserData = await newUser(userData as any)
            return cb(null, { ...newUserData, accessToken }, { message: 'success' });
        }
    } catch (error: any) {
        return cb(null, false, { message: 'Server error' });
    }
});

export default facebook
