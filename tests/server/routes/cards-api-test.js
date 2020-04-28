const request = require('supertest');
const {app} = require('../../../src/server/app');

test("Test get all cards", async () => {

    const response = await request(app)
        .get('/api/cards');
    expect(response.statusCode).toBe(200);
    expect(response.body.length).toBeGreaterThan(1);

});

test("Test get one card", async () => {

    const cardId = 0;

    const response = await request(app)
        .get('/api/cards/' + cardId);
    expect(response.statusCode).toBe(200);

    const card = response.body;
    expect(card.id).toEqual(cardId);
    expect(card.name).toBeDefined();
    expect(card.latinName).toBeDefined();
    expect(card.painLevel).toBeDefined();
    expect(card.description).toBeDefined();
    expect(card.value).toBeDefined();

});

test("Test fail to get card", async () => {

    let response = await request(app)
        .get('/api/cards');
    const cardAmount = response.body.length;

    // IDs start at 0, so cardAmount is highest ID + 1
    response = await request(app)
        .get('/api/cards/' + cardAmount);
    expect(response.statusCode).toBe(404);

});