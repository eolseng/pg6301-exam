const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const path = require('path');

const Users = require('./db/users');
const authApi = require('./routes/auth-api');
const userApi = require('./routes/user-api');
const cardsApi = require('./routes/cards-api');
const lootboxApi = require('./routes/lootbox-api');

const WsHandler = require('./ws/ws-handler');

const app = express();

// Handle JSON Payloads
app.use(bodyParser.json());

// Setup WebSocket handling
WsHandler.init(app);

// Setup user session cookies
app.use(session({
    secret: 'the best secret ever kept secret until now',
    resave: false,
    saveUninitialized: false
}));

// Serve static content from the public folder
app.use(express.static('public'));

// Setup user authentication with Passport
passport.use(new LocalStrategy(
    {
        usernameField: 'userId',
        passwordField: 'password'
    },
    function (userId, password, done) {

        const verified = Users.verifyUser(userId, password);

        if (!verified) {
            return done(null, false, {message: 'Invalid username/password'});
        }

        const user = Users.getUser(userId);
        return done(null, user);
    }
));

passport.serializeUser(function (user, done) {
    done(null, user.id)
});

passport.deserializeUser(function (id, done) {

    const user = Users.getUser(id);

    if (user) {
        done(null, user)
    } else {
        done(null, false);
    }
});

app.use(passport.initialize());
app.use(passport.session());

// Routes:
app.use('/api', authApi);
app.use('/api', userApi);
app.use('/api', cardsApi);
app.use('/api', lootboxApi);

app.use((req, res, next) => {
    res.sendFile(path.resolve(__dirname, '..', '..', 'public', 'index.html'));
});

module.exports = {app};