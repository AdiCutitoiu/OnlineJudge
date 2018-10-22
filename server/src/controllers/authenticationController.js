const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const userModel = require('../models/user');
const sha256 = require('crypto-js/sha256');

function createToken({ id, email, role }) {
    return jwt.sign({ id, email, role }, "secret");
}

class AuthenticationController {
    async register({ email, password }) {

        const passwordHash = sha256(password);

        const user = await userModel.create({
            email,
            passwordHash
        });

        return createToken(user);
    }

    async login({ email, password }) {
        const passHash = sha256(password);

        const user = await userModel.findOne({ email });

        if (user.passwordHash == passHash) {
            return createToken(user);
        }

        return null;
    }
}

module.exports = new AuthenticationController();