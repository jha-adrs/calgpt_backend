const passport = require("passport")

module.exports = (req, res) => {
    passport.authenticate("google", {
        scope: ["profile", "email"]
    })(req, res)
}