const express = require('express');

const Cards = require('../db/cards');

const router = express.Router();

router.get('/cards', function (req, res) {
    // This endpoint is public. Everyone should be able to view the list of cards.
    const cards = Cards.getAllCards();
    res.status(200).json([...cards.values()]);
});

router.get('/cards/:cardId', function (req, res) {

    // THIS ENDPOINT IS NOT USED IN THE FRONT END

    // This endpoint is public. Everyone should be able to retrieve a single card.
    const card = Cards.getCard(parseInt(req.params.cardId));

    if(!card) {
        res.status(404).send();
        return;
    }

    res.status(200).json(card);
});

module.exports = router;