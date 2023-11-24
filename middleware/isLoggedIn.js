const { logger } = require("../utils/logger");

function isLoggedIn(req, res, next) {
    if (req.user) {
      logger.info('Inside isLoggedIn', req.user);
      next();
    } else {
      // User is not authenticated, send an error response or redirect
      logger.info('Inside isLoggedIn else', req.user);
      res.status(401).send('You must be logged in to access this resource.');
    }
  }
  
  module.exports = isLoggedIn;