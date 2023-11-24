const passport = require('passport');
const { logger } = require('../utils/logger');
const { Router } = require('express');
const router = Router();

//router.get('/google/callback',require('../controllers/google/callback'));
router.get('/google/callback',passport.authenticate('google', { failureRedirect: '/' }),
function (req, res) {
    logger.info('Inside google callback final', req.body)
    res.redirect('/user/profile');
});

router.get('/google',require('../controllers/google/google'));
router.get('/profile',require('../controllers/user/profile'));




module.exports = router;