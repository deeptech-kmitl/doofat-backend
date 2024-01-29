import { OAuth2Strategy as GoogleStrategy } from 'passport-google-oauth'
import { getUserByEmail, newUser, updateGoogleId } from "../../models/users.model"

const google = new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID || "GOOGLE_CLIENT_ID",
    clientSecret: process.env.GOOGLE_CLIENT_SECRET || "GOOGLE_CLIENT_SECRET",
    callbackURL: '/callback/google',
}, async (accessToken, refreshToken, profile, cb) => {
    const id = profile.id;
    const email = profile.emails?.[0].value || null;
    const name = profile.displayName;
    const avatar = profile.photos?.[0].value || null;
    console.log(profile);

    // no permission to access email
    if (!email)
        return cb(null, false, { message: "no permission to access email" });

    try {
        const user = await getUserByEmail(email)

        if (user) {
            if (user.googleId !== id) {
                // update googleId to link account
                const updatedUser = await updateGoogleId(user.id, id)
                return cb(null, { ...updatedUser, accessToken }, { message: 'success' });
            }
            return cb(null, { ...user, accessToken }, { message: 'success' });
        } else {
            // create new user
            const userData = {
                name,
                email,
                avatar,
                googleId: id,
            }
            const newUserData = await newUser(userData as any)
            return cb(null, { ...newUserData, accessToken }, { message: 'success' });
        }
    } catch (error: any) {
        return cb(null, false, { message: 'Server error' });
    }
});

export default google
