const passport = require('passport');
const google_auth = require('../../models/google_auth');
const jwt = require('jsonwebtoken');
const { logger } = require('../../utils/logger');
module.exports = async (req, res) => {
    passport.authenticate("google", { session: false }),
        (req, res) => {
            logger.info('Inside google callback', req.body)
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
        }
}