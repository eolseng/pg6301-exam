const request = require('supertest');
const {app} = require('../../../src/server/app');

let idCounter = 0;

async function signUp(agent){

    const userId = "lootbox_test_" + idCounter++;
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

test('Test render not logged in', async () => {
    
    let response = await request(app)
        .post('/api/lootbox/purchase');
    expect(response.statusCode).toBe(401);

    response = await request(app)
        .post('/api/lootbox/open');
    expect(response.statusCode).toBe(401);
    
});

test('Test purchase lootbox', async () => {

    const agent = request.agent(app);
    await signUp(agent);

    const response = await agent
        .post('/api/lootbox/purchase');
    expect(response.statusCode).toBe(204);

});

test('Test insufficient cash', async () => {

    const agent = request.agent(app);
    await signUp(agent);

    let response = await agent
        .post('/api/lootbox/purchase');
    expect(response.statusCode).toBe(204);

    response = await agent
        .post('/api/lootbox/purchase');
    expect(response.statusCode).toBe(204);

    response = await agent
        .post('/api/lootbox/purchase');
    expect(response.statusCode).toBe(400);

});

test('Test open lootbox', async () => {

    const agent = request.agent(app);

    await signUp(agent);

    const response = await agent
        .post('/api/lootbox/open');
    expect(response.statusCode).toBe(202);
    
    const cards = response.body;
    expect(cards.length).toBe(3);
    
});

test('Test open too many lootboxes', async () => {

    const agent = request.agent(app);

    await signUp(agent);

    let response;
    for(let i = 0; i < 3; i++) {
        response = await agent
            .post('/api/lootbox/open');
        expect(response.statusCode).toBe(202);
    }
    
    response = await agent
        .post('/api/lootbox/open');
    expect(response.statusCode).toBe(400);
    
});
