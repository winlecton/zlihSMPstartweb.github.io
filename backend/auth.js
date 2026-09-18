const crypto = require("crypto");

function login(username, password) {
    return (
        username === process.env.ADMIN_USERNAME &&
        password === process.env.ADMIN_PASSWORD
    );
}

function createToken() {
    return crypto.randomBytes(32).toString("hex");
}

module.exports = {
    login,
    createToken
};