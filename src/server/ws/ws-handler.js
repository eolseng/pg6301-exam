const expressWs = require('express-ws');

const Tokens = require('./tokens');
const ActiveUsers = require('../online/active-users');
const Users = require('../db/users');

let ews;

function init(app) {

    ews = expressWs(app);

    app.ws('/notifications', (ws) => {

        // Setup Handlers for different topics
        ws.messageHandlers = new Map();
        ws.addMessageHandler = (topic, handler) => {
            ws.messageHandlers.set(topic, handler);
        };
        ws.addMessageHandler("login", handleLogin);

        // Handle new incoming messages from clients
        ws.on('message', (data) => {

            if (!data) {
                ws.send(JSON.stringify({topic: "update", error: "No payload provided"}));
                return;
            }

            const dto = JSON.parse(data);
            const topic = dto.topic;
            if (!topic) {
                ws.send(JSON.stringify({topic: "update", error: "No defined topic"}));
                return;
            }

            const handler = ws.messageHandlers.get(topic);
            if (!handler) {
                ws.send(JSON.stringify({topic: "update", error: "Unrecognized topic: " + topic}));
                return;
            }

            handler(ws, dto);

        });

        // Handle clients closing connections
        ws.on('close', () => {
            ActiveUsers.removeLootboxHandler(ws.id);
        });
    });
}

function handleLogin(ws, dto) {

    const token = dto.wstoken;
    if (!token) {
        ws.send(JSON.stringify({topic: "update", error: "Missing token"}));
        ws.close();
        return;
    }

    const userId = Tokens.consumeToken(token);
    if (!userId) {
        ws.send(JSON.stringify({topic: "update", error: "Invalid token, no user found"}));
        ws.close();
        return;
    }

    const user = Users.getUser(userId);

    const handler = setInterval(() => {
        user.lootboxes++;
        ws.send(JSON.stringify({topic: "new_lootbox", data: "You have received a new lootbox"}));
    }, 60 * 1000);
    ActiveUsers.registerLootboxHandler(userId, handler);

    ws.id = userId;
    const data = JSON.stringify({topic: 'update', data: "Authentication successful"});
    ws.send(data);
}

module.exports = {init};