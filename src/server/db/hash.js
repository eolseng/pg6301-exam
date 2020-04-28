/*
    WARNING: THIS IS A VERY UNSAFE WAY TO HASH PASSWORDS!
    I have used this method as 'BCrypt' has dependencies I can not guarantee the examiner has installed (I.E. Python 2.x).
    For this solution I use MD5, which is NOT secure, but still better than storing passwords in plain text.
    
    The solution is taken from: https://dev.to/nedsoft/a-simple-password-hash-implementation-3hcg
 */

const md5 = require('md5');

// Using a global salt in case an attacker gets access to the database but not source code.
const globalSalt = "EverybodyWasKungFuSalting";

function hashPassword(rawPassword, options = {}) {

    const salt = options.salt ? options.salt : new Date().getTime();
    const rounds = options.rounds ? options.rounds : 10;

    let hashed = md5(rawPassword + salt + globalSalt);
    for (let i = 0; i < rounds; i++) {
        hashed = md5(hashed);
    }

    return `${salt}$${rounds}$${hashed}`;
}

function comparePassword(rawPassword, hashedPassword) {

    const [salt, rounds] = hashedPassword.split('$');
    const hashedRawPassword = hashPassword(rawPassword, {salt, rounds});
    return hashedPassword === hashedRawPassword;

}

module.exports = {hashPassword, comparePassword};
