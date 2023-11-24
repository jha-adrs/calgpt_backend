const { logger } = require("../../utils/logger");

module.exports = async (req, res) => {
    try {
        
            req.logout(function (err) {
                if (err) {
                    logger.error("Error in logout.js req.logout", err);
                    return res.status(500).json({ error: err.message })
                }
            });   
            res.clearCookie('connect.sid');
           return res.redirect('/');
        
    } catch (error) {
        logger.error("Error in logout.js", error);
        return res.status(500).json({ error: error.message });
    }
}