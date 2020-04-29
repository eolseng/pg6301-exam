const lootboxHandler = new Map();
const authenticatedChatters = new Set();

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

function registerChatter(userId){
    authenticatedChatters.add(userId)
}

function validateChatter(userId) {
    return authenticatedChatters.has(userId);
}

function removeChatter(userId) {
    authenticatedChatters.delete(userId);
}

module.exports = {
    registerLootboxHandler,
    getLootboxHandler,
    removeLootboxHandler,
    registerChatter,
    validateChatter,
    removeChatter
};
