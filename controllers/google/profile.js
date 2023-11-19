const passport = require("passport")
const { logger } = require("../../utils/logger")

module.exports = (req, res) => {
    logger.info('Inside google callback',req.body)
    res.send('Inside google callback').status(200);
}