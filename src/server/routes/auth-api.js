const express = require('express');
const passport = require('passport');

const Users = require('../db/users');
const Tokens = require('../ws/tokens');

const router = express.Router();

router.post('/signup', function (req, res) {

    // This endpoint is PUBLIC and available to everyone

    const created = Users.createUser(req.body.userId, req.body.password);
    
    if (!created) {
        res.status(400).send();
        return;
    }

    passport.authenticate('local')(req, res, () => {
        req.session.save((err) => {
            if (err) {
                res.status(500).send();
            } else {
                res.status(201).send();
            }
        });
    });
});

router.post('/login', passport.authenticate('local'), (req, res) => {

    if (!req.user) {
        res.status(401).send();
        return;
    }
    
    res.status(204).send();
});

router.post('/logout', function (req, res) {

    // This endpoint is PUBLIC and available to everyone
    
    req.logout();
    res.status(204).send();
});

router.post('/wstoken', function (req, res) {

    if (!req.user) {
        res.status(401).send();
        return;
    }

    const token = Tokens.createToken(req.user.id);
    res.status(201).json({wstoken: token});

});

module.exports = router;
