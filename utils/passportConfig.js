require('dotenv').config();
const _ = require('lodash');
const GoogleStrategy = require("passport-google-oauth2").Strategy;
const JwtStrategy = require("passport-jwt").Strategy;
const { ExtractJwt } = require('passport-jwt');
const { logger } = require('../utils/logger');
const { query } = require('../utils/mysql');
const { v4: uuidv4 } = require('uuid');

module.exports = (passport) => {
    passport.use(
        client = new GoogleStrategy({
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: process.env.AUTH_CALLBACK_URL,
            passReqToCallback: true

        },
            async (request, accessToken, refreshToken, profile, done) => {
                logger.info('Google callback');
                try {
                    logger.info('Profile', profile);
                    const { email, name, picture } = profile;
                    // Check if user exists
                    const user = await query(`select * from users where email = ?`, [email]);
                    logger.info('User', user);
                    if (user.length > 0) {
                        return done(null, profile);
                    }

                    const user_id = uuidv4();
                    const response = await query(`insert into users (user_id, email, name, picture) values (?, ?, ?, ?)`, [user_id, email, name, picture]);
                    logger.info('Response from google auth', response);
                    return done(null, profile);
                } catch (error) {
                    logger.error(error);
                    return done(error, null);
                }
            }
        )
    );
    passport.use(
        new JwtStrategy(
            {
                jwtFromRequest: ExtractJwt.fromHeader('authorization'),
                secretOrKey: process.env.JWT_SECRET,
            },
            async (jwtPayload, done) => {
                logger.info('Inside jwt strategy', jwtPayload);
                try {
                    const user = await query(`select * from users where email = ?`, [jwtPayload.user.email]);
                    logger.info('User', user);
                    if (user.length > 0) {
                        return done(null, _.get(user, '[0]'));
                    }
                    return done(null, false);
                } catch (error) {
                    logger.error(error);
                    return done(error, false);
                }
            }
        )
    )

}   