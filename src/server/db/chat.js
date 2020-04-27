
const chatMessages = [];

class ChatMessage {
    constructor(userId, message) {
        let ts = new Date();
        let date = ts.getFullYear() + '/' + (ts.getMonth() + 1) + '/' + ts.getDate();
        let time = prettyTime(ts);

        this.userId = userId;
        this.message = message;
        this.timestamp = date + " - " + time;
    }
}

function createMessage(user, message) {
    const chatMessage = new ChatMessage(user, message);
    chatMessages.unshift(chatMessage);
    return chatMessage;
}

function getAllMessages() {
    return chatMessages;
}

function resetAllMessages() {
    chatMessages.length = 0;
}

function prettyTime(date) {

    let hours;
    if(date.getHours() >= 10) hours = date.getHours();
    else hours = "0" + date.getHours();

    let minutes;
    if(date.getMinutes() >= 10) minutes = date.getMinutes();
    else minutes = "0" + date.getMinutes();

    let seconds;
    if(date.getSeconds() >= 10) seconds = date.getSeconds();
    else seconds = "0" + date.getSeconds();

    return hours + ":" + minutes + ":" + seconds;

}

module.exports = {createMessage, getAllMessages, resetAllMessages};