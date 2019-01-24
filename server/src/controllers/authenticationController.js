const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const userModel = require('../models/user');
const sha256 = require('crypto-js/sha256');

function createToken({ id, email, role }) {
    return jwt.sign({ id, email, role }, "secret");
}

class AuthenticationController {
    async createAdminIfNotExist({ email, password }) {
        let admin = await userModel.findOne({ role: 'Admin' });

        if(!email || !password) {
            return false;
        }

        if (!admin) {
            this.register(email, password);

            let admin = await userModel.findOneAndUpdate(
                { email: email },
                { role: 'Admin' },
                { new: true }
            );

            if (!admin) {
                return false;
            }
        }

        return true;
    }

    async register({ email, password }) {
        if (!email || !password) {
            throw new Error('email and password not provided');
        }

        const passwordHash = sha256(password);

        const user = await userModel.create({
            email,
            passwordHash
        });

        return createToken(user);
    }

    async login({ email, password }) {
        if (!email || !password) {
            throw new Error('email and password not provided');
        }

        const passHash = sha256(password);

        const user = await userModel.findOne({ email });

        if (user.passwordHash == passHash) {
            return createToken(user);
        }

        return null;
    }

    async changePassword(user, { password }) {
        if (!password) {
            throw new Error('password not provided');
        }

        user.password = sha256(password);
        user.save();
    }
}

module.exports = new AuthenticationController();