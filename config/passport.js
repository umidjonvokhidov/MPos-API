import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { Strategy as AppleStrategy } from "passport-apple";
import User from "../models/user.model.js";
import {
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
  GOOGLE_CALLBACK_URL,
  APPLE_CLIENT_ID,
  APPLE_TEAM_ID,
  APPLE_KEY_ID,
  APPLE_PRIVATE_KEY,
  APPLE_CALLBACK_URL,
} from "./env.js";

passport.use(
  new GoogleStrategy(
    {
      clientID: GOOGLE_CLIENT_ID,
      clientSecret: GOOGLE_CLIENT_SECRET,
      callbackURL: GOOGLE_CALLBACK_URL,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const googleId = profile.id;
        const email = profile.emails[0].value;
        const name = profile.displayName || '';
        const picture = profile.photos && profile.photos[0] ? profile.photos[0].value : '';
        let user = await User.findOne({
          $or: [
            { email },
            { 'linkedAccounts.provider': 'google', 'linkedAccounts.providerId': googleId },
          ],
        });
        if (!user) {
          user = await User.create({
            firstname: profile.name?.givenName || '',
            lastname: profile.name?.familyName || '',
            email,
            linkedAccounts: [
              {
                provider: 'google',
                providerId: googleId,
                email,
                name,
                picture,
              },
            ],
          });
        } else {
          const existingProvider = user.linkedAccounts.find(p => p.provider === 'google');
          if (!existingProvider) {
            user.linkedAccounts.push({
              provider: 'google',
              providerId: googleId,
              email,
              name,
              picture,
            });
            await user.save();
          } else if (existingProvider.providerId !== googleId) {
            existingProvider.providerId = googleId;
            existingProvider.email = email;
            existingProvider.name = name;
            existingProvider.picture = picture;
            await user.save();
          }
        }
        return done(null, user);
      } catch (err) {
        return done(err, null);
      }
    }
  )
);

passport.use(
  new AppleStrategy(
    {
      clientID: APPLE_CLIENT_ID,
      teamID: APPLE_TEAM_ID,
      keyID: APPLE_KEY_ID,
      privateKey: APPLE_PRIVATE_KEY.replace(/\\n/g, '\n'),
      callbackURL: APPLE_CALLBACK_URL,
      passReqToCallback: false,
    },
    async (accessToken, refreshToken, idToken, profile, done) => {
      try {
        const appleId = idToken.sub;
        const email = idToken.email;
        const name = idToken.name || {};
        let user = await User.findOne({
          $or: [
            { email },
            { 'linkedAccounts.provider': 'apple', 'linkedAccounts.providerId': appleId },
          ],
        });
        if (!user) {
          user = await User.create({
            firstname: name.givenName || '',
            lastname: name.familyName || '',
            email,
            linkedAccounts: [
              {
                provider: 'apple',
                providerId: appleId,
                email,
                name: `${name.givenName || ''} ${name.familyName || ''}`.trim(),
                picture: '',
              },
            ],
          });
        } else {
          // Add or update the apple provider entry
          const existingProvider = user.linkedAccounts.find(p => p.provider === 'apple');
          if (!existingProvider) {
            user.linkedAccounts.push({
              provider: 'apple',
              providerId: appleId,
              email,
              name: `${name.givenName || ''} ${name.familyName || ''}`.trim(),
              picture: '',
            });
            await user.save();
          } else if (existingProvider.providerId !== appleId) {
            existingProvider.providerId = appleId;
            existingProvider.email = email;
            existingProvider.name = `${name.givenName || ''} ${name.familyName || ''}`.trim();
            await user.save();
          }
        }
        return done(null, user);
      } catch (err) {
        return done(err, null);
      }
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});

export default passport; 