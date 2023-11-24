require('dotenv').config();
const _ = require('lodash');
var GoogleStrategy = require("passport-google-oauth20").Strategy;
const JwtStrategy = require("passport-jwt").Strategy;
const { ExtractJwt } = require('passport-jwt');
const { logger } = require('../utils/logger');
const { query } = require('../utils/mysql');
const { v4: uuidv4 } = require('uuid');
const passport = require('passport');

// Add more data in the cookie payload
passport.use(
    client = new GoogleStrategy({
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: process.env.AUTH_CALLBACK_URL,
        passReqToCallback: true

    },
        async (request,accessToken, refreshToken, profile, cb) => {
            logger.info('Google callback', typeof request,typeof profile, typeof accessToken, typeof refreshToken, typeof cb);
            try {
                
                logger.info('Profile', profile, accessToken, refreshToken);
                const { email, displayName, picture } = profile?._json;
                // Check if user exists
                const user = await query(`select * from users where email = ?`, [email]);
                logger.info('User', user);
                if (user.length > 0) {
                    logger.info('User exists');
                    return cb(null, profile);
                }

                const user_id = uuidv4();
                const response = await query(`insert into users (user_id, email, name, picture) values (?, ?, ?, ?)`, [user_id, email, displayName, picture]);
                logger.info('Response from google auth', response);
                return cb(null, profile);
            } catch (error) {
                logger.error("Error in google autentication",error);
                return cb(error, null);
            }
        }
    )
);

passport.serializeUser(function (user, done) {
    logger.info('Serialize user', user);
    done(null, user);
});

passport.deserializeUser(function (user, done) {
    logger.info('Deserialize user', user);
    done(null, user);
});