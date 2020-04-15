// Simulated user database

const users = new Map();

class User {
    constructor(id, password) {
        // TODO: Fill in other fields belonging to the user
        this.id = id;
        this.password = password
    }
}

function getUser(id) {
    return users.get(id);
}

function createUser(id, password) {

    if (getUser(id)) {
        return false;
    }

    const user = new User(id, password);

    users.set(id, user);
    return true;

}

function verifyUser(id, password) {

    const user = getUser(id);

    if (!user) {
        return false;
    }

    return user.password === password;

}

function resetAllUsers() {
    users.clear();
}

module.exports = {getUser, createUser, verifyUser, resetAllUsers};