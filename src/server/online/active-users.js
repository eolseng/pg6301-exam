const socketToUser = new Map();
const userToSocket = new Map();

const lootboxHandler = new Map();

function registerLootboxHandler(userId, handler) {
    lootboxHandler.set(userId, handler);
}

function getLootboxHandler(userId) {
    return lootboxHandler.get(userId);
}

function removeLootboxHandler(userId) {
    const handler = lootboxHandler.get(userId);
    if (handler) {
        clearInterval(handler);
    }
    lootboxHandler.delete(userId);
}

function registerSocket(ws, userId) {
    socketToUser.set(ws.id, userId);
    userToSocket.set(userId, ws);
}

function removeSocket(socketId) {
    const userId = socketToUser.get(socketId);
    socketToUser.delete(socketId);
    userToSocket.delete(userId);
}

function removeUser(userId) {
    const socket = userToSocket.get(userId);
    socketToUser.delete(socket);
    userToSocket.delete(userId);
}

function isActive(userId) {
    return userToSocket.has(userId);
}

function getSocket(userId) {
    return userToSocket.get(userId);
}

function getUser(socketId) {
    return socketToUser.get(socketId);
}

module.exports = {
    registerLootboxHandler,
    getLootboxHandler,
    removeLootboxHandler,
    registerSocket,
    removeSocket,
    removeUser,
    isActive,
    getSocket,
    getUser
};
