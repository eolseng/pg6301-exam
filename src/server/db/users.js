const {hashPassword, comparePassword} = require('./hash');

// Simulated in-memory user database using a Map
const users = new Map();

class User {
    constructor(id, password) {
        this.id = id;
        this.password = password;
        this.cash = 1000;
        this.cards = new Map();
        this.lootboxes = 3;
    }
}

function getUser(id) {
    return users.get(id);
}

function createUser(id, password) {

    if (getUser(id)) {
        // Hashing so the response takes the same time even if username i already taken.
        hashPassword(password);
        return false;
    }
    
    const hashedPassword = hashPassword(password);
    
    const user = new User(id, hashedPassword);

    users.set(id, user);
    return true;

}

function verifyUser(id, password) {

    const user = getUser(id);

    if (!user) {
        // Hashing so the response takes the same time even if user does not exist.
        // This way an attacker can not check the response time to see if the userId is registered or not.
        hashPassword(password);
        return false;
    }

    return comparePassword(password, user.password);
}

function resetAllUsers() {
    users.clear();
}

module.exports = {getUser, createUser, verifyUser, resetAllUsers};