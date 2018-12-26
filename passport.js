const passport = require('passport');
const Strategy = require('passport-local').Strategy;

passport.use(new Strategy(
    function(username, password, cb) {
        if (username == process.env.ADMIN && password == process.env.PASS) {
            return cb(null, username);
        }
        return cb(null, false);
}));

passport.serializeUser(function(user, cb) {
    cb(null, user);
});

passport.deserializeUser(function(user, cb) {
    cb(null, user);
});

module.exports = passport;