const request = require('supertest');
const {app} = require('../../../src/server/app');
const WS = require('ws');

const {asyncCheckCondition} = require('../../mytest-utils');
const {checkConnectedWS} = require('../../mytest-utils-ws');
const {resetAllUsers} = require('../../../src/server/db/users');

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

test("Test create Chat WebSocket", async () => {

    const agent = request.agent(app);
    await signUp(agent, "Foo");
    const token = await createToken(agent);

    const ws = new WS('ws://localhost:' + port + "/chat");
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
    let messages = [];
    ws.on('message', data => {

        data = JSON.parse(data);

        if (data.topic === 'update') {
            if (data.error) {
                errors.push(data.error)
            } else {
                updates.push(data.data)
            }
        } else if (data.topic === 'all_messages') {
            messages = data.data;
        } else if (data.topic === 'new_message') {
            messages.unshift(data.message);
        }
    });

    let updated = await asyncCheckCondition(() => {
        return updates.length === 1
    }, 2000, 200);
    expect(updated).toEqual(true);

    payload = JSON.stringify({
        topic: 'new_chat_message',
        data: {message: 'Heisann'}
    });
    ws.send(payload);

    updated = await asyncCheckCondition(() => {
        return messages.length === 1
    }, 2000, 200);
    expect(updated).toEqual(true);

});

test('Test missing token for authentication', async () =>{

    const agent = request.agent(app);
    await signUp(agent, "Bar");
    const ws = new WS('ws://localhost:' + port + "/chat");
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
        } else if (data.topic === 'all_messages') {
            messages = data.data;
        } else if (data.topic === 'new_message') {
            messages.unshift(data.message);
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

test('Test invalid token for authentication', async () =>{

    const agent = request.agent(app);
    await signUp(agent, "Bar");
    const ws = new WS('ws://localhost:' + port + "/chat");
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
        } else if (data.topic === 'all_messages') {
            messages = data.data;
        } else if (data.topic === 'new_message') {
            messages.unshift(data.message);
        }
    });

    // Invalid token is payload
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

test('Test send unauthenticated message', async () =>{

    const agent = request.agent(app);
    await signUp(agent, "Foo");
    const ws = new WS('ws://localhost:' + port + "/chat");
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
        } else if (data.topic === 'all_messages') {
            messages = data.data;
        } else if (data.topic === 'new_message') {
            messages.unshift(data.message);
        }
    });

    let payload = JSON.stringify({
        topic: 'new_chat_message',
        data: {message: "Jasså"}
    });
    ws.send(payload);

    let updated = await asyncCheckCondition(() => {
        return errors.length === 1
    }, 2000, 200);
    expect(updated).toEqual(true);

});

test('Test various errors', async () =>{

    const agent = request.agent(app);
    await signUp(agent, "Foo");
    const ws = new WS('ws://localhost:' + port + "/chat");
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
        } else if (data.topic === 'all_messages') {
            messages = data.data;
        } else if (data.topic === 'new_message') {
            messages.unshift(data.message);
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