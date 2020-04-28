const express = require('express');

const Cards = require('../db/cards');

const router = express.Router();

router.get('/user', function (req, res) {

    if (!req.user) {
        res.status(401).send();
        return;
    }

    let cardAmount = 0;
    req.user.cards.forEach(card => cardAmount += card);

    res.status(200).json({
        id: req.user.id,
        cash: req.user.cash,
        cardAmount: cardAmount,
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

module.exports = router;
