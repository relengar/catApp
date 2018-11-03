const passport = require("passport");

module.exports = app => {
    app.post('/api/login', (req, res) => {
        passport.authenticate('login', (err, user, info) => {
            user && req.login(user, () => { res.send(user) });
            !user && res.status(401).send(info);
        })(req, res);
    });

    app.get('/api/logout', (req, res) => {
        req.logout();
        res.redirect('/');
    });

    app.get("/api/current_user", (req, res) => {
        res.send(req.user);
    });
}
