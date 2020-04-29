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

module.exports = {
    registerLootboxHandler,
    getLootboxHandler,
    removeLootboxHandler,
};
