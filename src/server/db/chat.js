// In memory database for public chat messages

const messages = [];

let idCounter = 0;

class ChatMessage {
    constructor(userId, message) {
        this.id = idCounter++;
        this.userId = userId;
        this.message = message;
    }
}

function createChatMessage(userId, message) {
    const msg = new ChatMessage(userId, message);
    messages.unshift(msg);
    return msg;
}

function getAllChatMessages() {
    return messages;
}

module.exports = {createChatMessage, getAllChatMessages}