const expressWs = require('express-ws');

const Tokens = require('./tokens');
const ActiveUsers = require('../online/active-users');
const Users = require('../db/users');
const Chat = require('../db/chat');

let ews;

function init(app) {

    ews = expressWs(app);

    app.ws('/notifications', (ws) => {

        // Setup Handlers for different topics
        ws.messageHandlers = new Map();
        ws.addMessageHandler = (topic, handler) => {
            ws.messageHandlers.set(topic, handler);
        };
        ws.addMessageHandler("login", handleNotificationLogin);

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

    app.ws('/chat', (ws) => {

        // Setup Handlers for different topics
        ws.messageHandlers = new Map();
        ws.addMessageHandler = (topic, handler) => {
            ws.messageHandlers.set(topic, handler);
        };
        ws.addMessageHandler("login", handleChatLogin);
        ws.addMessageHandler("new_chat_message", handleNewChatMessage);

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
            ActiveUsers.removeChatter(ws.id);
        });

    });
}

function handleNotificationLogin(ws, dto) {

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

function handleChatLogin(ws, dto) {

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

    ActiveUsers.registerChatter(userId);

    ws.id = userId;
    const data = JSON.stringify({topic: 'update', data: "Authentication successful"});
    ws.send(data);

    sendMessageLog(ws);

}

function sendMessageLog(ws) {

    const authenticated = ActiveUsers.validateChatter(ws.id);
    if(!authenticated) {
        ws.send(JSON.stringify({topic: "update", error: "Unauthenticated user. Request rejected."}));
        return;
    }

    const messages = Chat.getAllChatMessages();
    const data = JSON.stringify({topic: 'all_messages', data: messages});
    ws.send(data);

}

function handleNewChatMessage(ws, dto) {

    // Broadcasts new chat messages to all active users

    const authenticated = ActiveUsers.validateChatter(ws.id);
    if(!authenticated) {
        ws.send(JSON.stringify({topic: "update", error: "Unauthenticated user. Request rejected."}));
        return;
    }

    const message = Chat.createChatMessage(ws.id, dto.data);
    const data = JSON.stringify({topic: 'new_message', data: message});

    ews.getWss().clients.forEach(client => {
        client.send(data);
    })
}

module.exports = {init};