const request = require('supertest');
const {app} = require('../../../src/server/app');

let counter = 0;

test("Test failed login", async () => {

    const response = await request(app)
        .post('/api/login')
        .send({userId: 'test_' + (counter++), password: 'test'})
        .set('Content-Type', 'application/json');
    expect(response.statusCode).toBe(401);

});

test("Test fail to retrieve data from non-existent user", async () => {

    const response = await request(app)
        .get('/api/user');
    expect(response.statusCode).toBe(401);

});

test("Test create user and get data", async () => {

    const userId = "test_" + (counter++);
    const password = "test";
    const agent = request.agent(app);

    // Sign up
    let response = await agent
        .post('/api/signup')
        .send({
            userId: userId,
            password: password
        })
        .set('Content-Type', 'application/json');
    expect(response.statusCode).toBe(201);

    // Confirm signed in after sign up
    response = await agent.get('/api/user');
    expect(response.statusCode).toBe(200);
    expect(response.body.id).toBe(userId);
    expect(response.body.password).toBeUndefined();

});

test("Test failed sign up", async () => {

    const userId = "test_" + (counter++);
    const password = "test";
    const agent = request.agent(app);

    // Sign up
    let response = await agent
        .post('/api/signup')
        .send({
            userId: userId,
            password: password
        })
        .set('Content-Type', 'application/json');
    expect(response.statusCode).toBe(201);

    // Sign up again with same credentials
    response = await agent
        .post('/api/signup')
        .send({
            userId: userId,
            password: password
        })
        .set('Content-Type', 'application/json');
    expect(response.statusCode).toBe(400);

});

test("Test create user, log out and log in again", async () => {

    const userId = 'test_' + (counter++);
    const password = 'test';
    const agent = request.agent(app);

    // Sign up
    let response = await agent
        .post('/api/signup')
        .send({
            userId: userId,
            password: password
        })
        .set('Content-Type', 'application/json');
    expect(response.statusCode).toBe(201);

    // Confirm signed up and logged in
    response = await agent.get('/api/user');
    expect(response.statusCode).toBe(200);

    // Test logout
    response = await agent.post('/api/logout');
    expect(response.statusCode).toBe(204);

    // Confirm logged out
    response = await agent.get('/api/user');
    expect(response.statusCode).toBe(401);

    // Test log in
    response = await agent
        .post('/api/login')
        .send({
            userId: userId,
            password: password
        })
        .set('Content-Type', 'application/json');
    expect(response.statusCode).toBe(204);

    // Confirm logged in
    response = await agent.get('/api/user');
    expect(response.statusCode).toBe(200);

});