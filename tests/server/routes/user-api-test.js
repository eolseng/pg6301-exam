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

test('Test mill card', async () => {

    const agent = request.agent(app);
    await signUp(agent);
    await openLootbox(agent);

    let response = await agent.get('/api/user/cards');
    expect(response.statusCode).toBe(200);

    const cardId = response.body[1].id;
    const cardAmount = response.body[1].amount;
    
    for (let i = 0; i < cardAmount; i++) {
        response = await agent.post('/api/user/cards/' + cardId + "/mill");
        expect(response.statusCode).toEqual(204);
    }

    response = await agent.get('/api/user/cards');
    expect(response.statusCode).toBe(200);
    
    const cards = response.body;
    
    let deleted = true;
    cards.forEach(card => {
        if (card.id === cardId) {
            deleted = false
        }
    });
    expect(deleted).toBe(true);

});

test('Test delete user', async () => {

    const agent = request.agent(app);
    const userId = "DeleteTest";
    const password = "123";

    // Sign up
    let response = await agent
        .post('/api/signup')
        .send({
            userId: userId,
            password: password
        })
        .set('Content-Type', 'application/json');
    expect(response.statusCode).toBe(201);

    // Fail to delete because of wrong password
    response = await agent
        .delete('/api/user/delete')
        .send({
            password: password + "FAIL"
        });
    expect(response.statusCode).toBe(400);

    // Successfully delete user
    response = await agent
        .delete('/api/user/delete')
        .send({
            password: password
        });
    expect(response.statusCode).toBe(204);

    // Verify logged out
    response = await agent
        .delete('/api/user/delete');
    expect(response.statusCode).toBe(401);

});

test('Test update password', async () => {

    const agent = request.agent(app);
    const userId = "DeleteTest";
    const password = "123";
    const newPassword = "321";

    // Fail because not signed in
    let response = await agent
        .put('/api/user/changepassword')
        .send({
            oldPassword: password,
            newPassword: newPassword
        });
    expect(response.statusCode).toBe(401);

    // Sign up
    response = await agent
        .post('/api/signup')
        .send({
            userId: userId,
            password: password
        })
        .set('Content-Type', 'application/json');
    expect(response.statusCode).toBe(201);

    // Fail to update password because of wrong old password
    response = await agent
        .put('/api/user/changepassword')
        .send({
            oldPassword: password + "FAIL",
            newPassword: newPassword
        });
    expect(response.statusCode).toBe(400);

    // Fail to update password of missing newPassword
    response = await agent
        .put('/api/user/changepassword')
        .send({
            oldPassword: password
        });
    expect(response.statusCode).toBe(400);

    // Successfully update the password
    response = await agent
        .put('/api/user/changepassword')
        .send({
            oldPassword: password,
            newPassword: newPassword
        });
    expect(response.statusCode).toBe(204);

    // Test still signed in
    response = await agent
        .get('/api/user');
    expect(response.statusCode).toBe(200);

});

