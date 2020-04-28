const express = require('express');

const Cards = require('../db/cards');

const router = express.Router();

const CARDS_IN_LOOTBOX = 3;
const PRICE_OF_LOOTBOX = 500;

router.post('/lootbox/purchase', function (req, res) {

    if (!req.user) {
        res.status(401).send();
        return;
    }

    const user = req.user;
    
    if (user.cash < PRICE_OF_LOOTBOX) {
        res.status(400).send();
        return;
    }

    user.cash -= PRICE_OF_LOOTBOX;
    user.lootboxes ++;

    res.status(204).send();
});

router.post('/lootbox/open', function (req, res) {

    if (!req.user) {
        res.status(401).send();
        return;
    }

    const user = req.user;

    if (user.lootboxes <= 0) {
        res.status(400).send();
        return;
    }

    user.lootboxes --;

    const cards = Cards.getRandomCards(CARDS_IN_LOOTBOX);
    cards.forEach(card => {
        const prevAmount = user.cards.get(card.id) ? user.cards.get(card.id) : 0;
        user.cards.set(card.id, prevAmount + 1);
    });

    res.status(202).json([...cards]);
});

module.exports = router;