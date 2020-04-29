const request = require('supertest');
const {app} = require('../../../src/server/app');
const WS = require('ws');

const {asyncCheckCondition} = require('../../mytest-utils');
const {checkConnectedWS} = require('../../mytest-utils-ws');
const {resetAllUsers} = require('../../../src/server/db/users');
const {getLootboxHandler} = require('../../../src/server/online/active-users');

let server;
let port;
const sockets = [];

beforeAll(done => {
    server = app.listen(0, () => {
        port = server.address().port;
        done();
    });
});

afterAll(() => {
    server.close();
});

afterEach(() => {
    resetAllUsers();
    for (let i = 0; i < sockets.length; i++) {
        sockets[i].close();
    }
    sockets.length = 0;
});

async function signUp(agent, userId) {
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

    // Confirm signed in after sign up
    response = await agent.get('/api/user');
    expect(response.statusCode).toBe(200);
    expect(response.body.id).toBe(userId);
    expect(response.body.password).toBeUndefined();
}

async function createToken(agent) {
    const response = await agent
        .post('/api/wstoken');
    expect(response.statusCode).toBe(201);
    expect(response.body.wstoken).toBeDefined();
    return response.body.wstoken;
}

test('Test create Notification WebSocket', async () => {

    const agent = request.agent(app);
    await signUp(agent, "Schmidt");
    const token = await createToken(agent);

    const ws = new WS('ws://localhost:' + port + "/notifications");
    sockets.push(ws);

    let isConnected = await checkConnectedWS(ws, 2000);
    expect(isConnected).toBe(true);

    // Authenticate socket connection
    let payload = JSON.stringify({
        topic: 'login',
        wstoken: token
    });
    ws.send(payload);

    const updates = [];
    const errors = [];
    const lootboxes = [];
    ws.on('message', data => {
        data = JSON.parse(data);
        if (data.topic === 'update') {
            if (data.error) {
                errors.push(data.error);
            } else {
                updates.push(data.data);
            }
        } else if (data.topic === 'new_lootbox') {
            lootboxes.push(data.data)
        }
    });

    let updated = await asyncCheckCondition(() => {
        return updates.length > 0;
    }, 2000, 200);
    expect(updated).toEqual(true);


    // // It takes 60 seconds between each loot box, so it has to wait a long time.
    // updated = await asyncCheckCondition(() => {
    //     return lootboxes.length > 0
    // }, 700000, 1000);
    // expect(updated).toEqual(true);

});

test('Test missing token for authentication', async () => {

    const agent = request.agent(app);
    await signUp(agent, "Bar");
    const ws = new WS('ws://localhost:' + port + "/notifications");
    sockets.push(ws);

    let isConnected = await checkConnectedWS(ws, 2000);
    expect(isConnected).toBe(true);

    const updates = [];
    const errors = [];
    let lootboxes = [];
    ws.on('message', data => {
        data = JSON.parse(data);
        if (data.topic === 'update') {
            if (data.error) {
                errors.push(data.error)
            } else {
                updates.push(data.data)
            }
        } else if (data.topic === 'new_lootbox') {
            lootboxes = data.data;
        }
    });

    // No token in payload
    let payload = JSON.stringify({
        topic: 'login'
    });
    ws.send(payload);

    let updated = await asyncCheckCondition(() => {
        return errors.length === 1
    }, 2000, 200);
    expect(updated).toEqual(true);

});

test('Test invalid token for authentication', async () => {

    const agent = request.agent(app);
    await signUp(agent, "Bar");
    const ws = new WS('ws://localhost:' + port + "/notifications");
    sockets.push(ws);

    let isConnected = await checkConnectedWS(ws, 2000);
    expect(isConnected).toBe(true);

    const updates = [];
    const errors = [];
    let lootboxes = [];
    ws.on('message', data => {
        data = JSON.parse(data);
        if (data.topic === 'update') {
            if (data.error) {
                errors.push(data.error)
            } else {
                updates.push(data.data)
            }
        } else if (data.topic === 'new_lootbox') {
            lootboxes = data.data;
        }
    });

    // No token in payload
    let payload = JSON.stringify({
        topic: 'login',
        wstoken: 'invalidToken'
    });
    ws.send(payload);

    let updated = await asyncCheckCondition(() => {
        return errors.length === 1
    }, 2000, 200);
    expect(updated).toEqual(true);

});

test('Test removed handler after close', async () => {

    const userId = "Bobby";

    const agent = request.agent(app);
    await signUp(agent, userId);
    const token = await createToken(agent);

    const ws = new WS('ws://localhost:' + port + "/notifications");
    sockets.push(ws);

    let isConnected = await checkConnectedWS(ws, 2000);
    expect(isConnected).toBe(true);

    // Authenticate socket connection
    let payload = JSON.stringify({
        topic: 'login',
        wstoken: token
    });
    ws.send(payload);

    const updates = [];
    const errors = [];
    const lootboxes = [];
    ws.on('message', data => {
        data = JSON.parse(data);
        if (data.topic === 'update') {
            if (data.error) {
                errors.push(data.error);
            } else {
                updates.push(data.data);
            }
        } else if (data.topic === 'new_lootbox') {
            lootboxes.push(data.data)
        }
    });

    let updated = await asyncCheckCondition(() => {
        return updates.length > 0;
    }, 2000, 200);
    expect(updated).toEqual(true);

    let handler = getLootboxHandler(userId);
    expect(handler).toBeDefined();

    ws.close();

    let closed = await asyncCheckCondition(() => {
        handler = getLootboxHandler(userId);
        return !handler;
    },2000, 200);
    expect(closed).toEqual(true);

});

test('Test various errors', async () =>{

    const agent = request.agent(app);
    await signUp(agent, "Foo");
    const ws = new WS('ws://localhost:' + port + "/notifications");
    sockets.push(ws);

    let isConnected = await checkConnectedWS(ws, 2000);
    expect(isConnected).toBe(true);

    const updates = [];
    const errors = [];
    let messages = [];
    ws.on('message', data => {

        data = JSON.parse(data);

        if (data.topic === 'update') {
            if (data.error) {
                errors.push(data.error)
            } else {
                updates.push(data.data)
            }
        } else if (data.topic === 'new_lootbox') {
            messages = data.data;
        }
    });

    // Undefined topic
    let payload = JSON.stringify({
        data: {message: "Jasså"}
    });
    ws.send(payload);

    let updated = await asyncCheckCondition(() => {
        return errors.length === 1
    }, 2000, 200);
    expect(updated).toEqual(true);

    // Unhandled topic
    payload = JSON.stringify({
        topic: 'barbar',
        data: {message: "Jasså"}
    });
    ws.send(payload);

    updated = await asyncCheckCondition(() => {
        return errors.length === 2
    }, 2000, 200);
    expect(updated).toEqual(true);

});