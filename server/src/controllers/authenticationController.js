const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const userModel = require('../models/user');

function createToken({id, email, role}) {
    return { id, email, token };
}

class AuthenticationController {
    async register({ email, password }) {
        const passwordHash = await bcrypt.hash(password);
        const user = await userModel.create({
            email,
            passwordHash
        });

        return createToken(user);
    }

    async login({ email, password }) {
        const passHash = await bcrypt.hash(password);

        const user = await user.findOne({ email, passwordHash: passHash });

        return createToken(user);
    }
}

module.exports = new AuthenticationController();