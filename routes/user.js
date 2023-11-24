const router = require('express').Router();
const { logger } = require('../utils/logger');

router.get('/profile',require('../controllers/user/profile'));

module.exports = router;