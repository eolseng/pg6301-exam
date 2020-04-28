const request = require('supertest');
const {app} = require('../../../src/server/app');

let idCounter = 0;

async function signUp(agent) {

    const userId = "user_test_" + idCounter++;
    const password = "test";

    // Sign up
    let response = await agent
        .post('/api/signup')
        .send({
            userId: userId,
            password: password
        })
        .set('Content-Type', 'application/json');
    expect(response.statusCode).toBe(201);

}

async function openLootbox(agent) {

    const response = await agent
        .post('/api/lootbox/open');
    expect(response.statusCode).toBe(202);

}

test("Test fail to get unauthenticated user data", async () => {

    let response = await request(app)
        .get('/api/user');
    expect(response.statusCode).toBe(401);

    response = await request(app)
        .get('/api/user/cards');
    expect(response.statusCode).toBe(401);

});

test('Test get user data', async () => {

    const url = '/api/user';
    const agent = request.agent(app);
    await signUp(agent);

    let response = await agent
        .get(url);
    expect(response.statusCode).toBe(200);
    
    expect(response.body.id).toBeDefined();
    expect(response.body.cash).toBeDefined();
    expect(response.body.cardAmount).toBeDefined();
    expect(response.body.lootboxes).toBeDefined();

});

test('Test get users cards', async () => {

    const url = '/api/user/cards';
    const agent = request.agent(app);
    await signUp(agent);

    let response = await agent
        .get(url);
    expect(response.statusCode).toBe(200);
    expect(response.body.length).toEqual(0);

    await openLootbox(agent);

    response = await agent
        .get(url);
    expect(response.statusCode).toBe(200);
    expect(response.body.length).toBeGreaterThan(0);

});
