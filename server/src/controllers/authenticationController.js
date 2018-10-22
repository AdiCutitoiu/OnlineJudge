const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const userModel = require('../models/user');

function createToken({ id, email, role }) {
    return jwt.sign({ id, email, role }, "secret");
}

const salt = bcrypt.genSaltSync(10);

class AuthenticationController {
    async register({ email, password }) {

        const passwordHash = await bcrypt.hash(password, '');

        const user = await userModel.create({
            email,
            passwordHash
        });

        return createToken(user);
    }

    async login({ email, password }) {
        const passHash = await bcrypt.hash(password, '');

        const user = await userModel.findOne({ email });

        if (user.passwordHash == passHash) {
            return createToken(user);
        }

        return null;
    }
}

module.exports = new AuthenticationController();