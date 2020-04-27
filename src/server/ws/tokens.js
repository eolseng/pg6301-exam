const crypto = require('crypto');

const tokens = new Map();

const randomId = () => {
    return crypto.randomBytes(10).toString('hex');
};

const createToken = (userId) => {
    const token = randomId();
    tokens.set(token, userId);
    return token;
};

const consumeToken = (token) => {
    const userId = tokens.get(token);
    tokens.delete(token);
    return userId;
};

module.exports = {createToken, consumeToken};