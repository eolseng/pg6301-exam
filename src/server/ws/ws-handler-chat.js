const expressWs = require('express-ws');

const Tokens = require('./tokens');
const ActiveUsers = require('../online/active-users');
const Chat = require('../db/chat');

let ews;

function init(app) {

    ews = expressWs(app);

    app.ws('/chat', (ws, req) => {

        // Setup Handlers for different topics
        ws.messageHandlers = new Map();
        ws.addMessageHandler = (topic, handler) => {
            ws.messageHandlers.set(topic, handler);
        };
        ws.addMessageHandler("login", handleLogin);
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
            const userId = ActiveUsers.getUser(ws.id);
            if(userId) {
                ActiveUsers.removeSocket(ws.id);
            }
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

    ws.id = userId;
    ActiveUsers.registerSocket(ws, userId);
    const data = JSON.stringify({topic: 'update', data: "Authentication successful"});
    ws.send(data);
    sendMessageLog(ws);
}

function handleNewChatMessage(ws, dto) {

    const userId = ActiveUsers.getUser(ws.id);
    if(!userId) {
        ws.send(JSON.stringify({topic: "update", error: "Unauthenticated user. Request rejected."}));
        return;
    }
    const message = Chat.createMessage(userId, dto.data.message);
    const data = JSON.stringify({topic: 'new_message', data: message});

    ews.getWss().clients.forEach((client) => {
        client.send(data);
    })
}

function sendMessageLog(ws) {
    const userId = ActiveUsers.getUser(ws.id);
    if(!userId) {
        ws.send(JSON.stringify({topic: "update", error: "Unauthenticated user. Request rejected."}));
        return;
    }
    const messages = Chat.getAllMessages();
    const data = JSON.stringify({topic: 'all_messages', data: messages});
    ws.send(data);
}

module.exports = {init};
