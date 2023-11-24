// Returns the user profile page

const { logger } = require("../../utils/logger")

// Path: controllers/user/profile.js
module.exports = (req, res) => {
    try {
     if(req.user){
            logger.info('Inside profile', req.user);
            res.send(`
            <h1>Profile</h1>
               <p>Welcome ${req.user.displayName}!</p>
               <button><a href="/logout">Logout</a></button>
            `).status(200);
     }
     else{
         logger.info('Inside profile else', req.user);
         res.status(401).send('You must be logged in to access this resource.');
     }
    } catch (error) {
     logger.error("Error in profile.js", error);
     return res.status(500).json({ error: error.message });
    }
}