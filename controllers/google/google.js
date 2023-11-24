const passport = require("passport")
const { logger } = require("../../utils/logger")
require("../../utils/passportConfig")
module.exports = (req, res, next) => {
    logger.info('Inside google')
    passport.authenticate('google', {
        scope: ['profile', 'email']
    })(req, res, next);
}