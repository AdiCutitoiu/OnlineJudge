const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

class AuthenticationController {
    async login({ username, password }) {
        const passHash = await bcrypt.hash(password);
        const token = jwt.sign({ username: username, password: passHash });

        return { token };
    }

    async register({ username, password }) {
        const passHash = await bcrypt.hash(password);
        const token = jwt.sign({ username: username, password: passHash });

        return { token };
    }
}

module.exports = new AuthenticationController();