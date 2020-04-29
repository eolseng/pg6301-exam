const express = require('express');

const Cards = require('../db/cards');
const Users = require('../db/users');

const router = express.Router();

router.get('/user', function (req, res) {

    if (!req.user) {
        res.status(401).send();
        return;
    }

    let cardAmount = 0;
    let cards = [];
    req.user.cards.forEach((value, key) => {
        cardAmount += value;
        cards.push({
            id: key,
            amount: value,
            card: Cards.getCard(key)
        });
    });

    res.status(200).json({
        id: req.user.id,
        cash: req.user.cash,
        cardAmount: cardAmount,
        cards: cards,
        lootboxes: req.user.lootboxes
    });
});

router.get('/user/cards', function (req, res) {

    if (!req.user) {
        res.status(401).send();
        return;
    }

    let cards = [];
    req.user.cards.forEach((value, key) => {
        cards.push({
            id: key,
            amount: value,
            card: Cards.getCard(key)
        });
    });

    res.status(200).json(cards);
});

router.post('/user/cards/:cardId/mill', function (req, res) {

    const cardId = parseInt(req.params.cardId);

    if (!req.user) {
        res.status(401).send();
        return;
    }

    const user = req.user;
    const amount = user.cards.get(cardId);

    if (!amount || amount <= 0) {
        res.status(400).send();
        return;
    } else if (amount === 1) {
        user.cards.delete(cardId);
    } else {
        user.cards.set(cardId, amount - 1);
    }

    const value = Cards.getCard(cardId).value;
    user.cash += value;

    res.status(204).send();

});

router.delete('/user/delete', function (req, res) {

    // THIS ENDPOINT IS NOT USED IN THE FRONT END

    const user = req.user;

    if (!user) {
        res.status(401).send();
        return
    }

    // Verify that the user knows the password before deleting the account.
    const password = req.body.password;
    const verified = Users.verifyUser(user.id, password);
    if (!verified) {
        res.status(400).send();
        return;
    }

    const deleted = Users.deleteUser(user.id);
    if (!deleted) {
        // The user was not found in the database and deletion failed.
        res.status(500).send();
        return;
    }

    req.logout();
    res.status(204).send();

});

router.put('/user/changepassword', function (req, res) {

    // THIS ENDPOINT IS NOT USED IN THE FRONT END

    const user = req.user;
    if (!user) {
        res.status(401).send();
        return
    }

    // Verify that the user knows the password before deleting the account.
    const oldPassword = req.body.oldPassword;
    const newPassword = req.body.newPassword;

    if (!oldPassword || !newPassword) {
        res.status(400).send();
        return;
    }

    // Verify that the user has the old password
    const verified = Users.verifyUser(user.id, oldPassword);
    if (!verified) {
        res.status(400).send();
        return;
    }

    const updated = Users.updatePassword(user.id, newPassword);
    if(!updated) {
        // User does not exist in the database
        res.status(500).send();
        return;
    }

    res.status(204).send();

});

module.exports = router;
