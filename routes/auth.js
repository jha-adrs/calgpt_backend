const { logger } = require('../utils/logger');
const { Router } = require('express');
const router = Router();

router.get('/google/callback',require('../controllers/google/callback'));
router.get('/google',require('../controllers/google/google'));
router.get('/profile',require('../controllers/google/profile'));


module.exports = router;