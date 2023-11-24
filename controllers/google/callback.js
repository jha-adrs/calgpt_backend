const passport = require('passport');
const jwt = require('jsonwebtoken');
const { logger } = require('../../utils/logger');
require('../../utils/passportConfig')
 const abc  = async (req, res) => {
    logger.info('Inside google final callback', req.body)
    try {
        passport.authenticate("google", successRedirect = '/auth/profile', failureRedirect = '/auth/google/callback', failureFlash = true,
        (req, res) => {
            logger.info('Inside google callback final', req.body)
            jwt.sign(
                { user: req.user },
                "secretKey",
                { expiresIn: "1h" },
                (err, token) => {
                    if (err) {
                        return res.json({
                            token: null,
                        });
                    }
                    res.json({
                        token,
                    });
                }
            );
        },(data)=>{
            logger.info('Inside google callback data function', data)
            return res.send(data).status(200);
        })(req, res)
    } catch (error) {
        logger.error("Error in callback.js",error);
        return res.status(500).json({ error: error.message });
    }
}

module.exports = passport.authenticate('google', { failureRedirect: '/' }),
function (req, res) {
    logger.info('Inside google callback final', req.body)
    res.redirect('/user/profile');
};