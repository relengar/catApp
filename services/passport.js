const passport = require("passport");
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const User = mongoose.model('User');


function validInputs(username, password) {
    return username && username.trim() !== '' && password && password.trim() !== '';
}

async function createNewUser(username, password, done) {
    const passwdHash = bcrypt.hashSync(password);
    const newUser = new User({
        username,
        passwdHash,
    });
    try {
        await newUser.save();
        return done(null, newUser);
    } catch (message) {
        return done(null, false, { message });
    }
}


passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser((id, done) => {
    User.findById(id)
        .then(user => {
            done(null, user);
        })
});

passport.use('login', new LocalStrategy(
     async (username, password, done) => {
        if (!validInputs(username, password)) {
            return done(null, false, { message: "Username or password are invalid." });
        }
        const user = await User.findOne({ username });
        // if user exists check password and return user or error
        if (user) {
            if (bcrypt.compareSync(password, user.passwdHash)) {
                return done(null, user);
            }
            else {
                return done(null, false, { message: "Invalid password." });
            }
        }
        // if user is not yet created create a new one
        else {
            await createNewUser(username, password, done);
        }
    }
));
