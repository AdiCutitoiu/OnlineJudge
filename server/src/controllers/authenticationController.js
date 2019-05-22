const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const userModel = require('../models/user');
const sha256 = require('crypto-js/sha256');

function createToken({ id, role, name }) {
  return {
    token: jwt.sign({ id }, "secret"),
    role,
    name
  };
}

class AuthenticationController {
  async createAdminIfNotExist({ email, password }) {
    let admin = await userModel.findOne({ role: 'Admin' });

    if (!email || !password) {
      return false;
    }

    if (!admin) {
      await this.register({ email, password });

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

  async register({ email, password, name }) {
    if (!email || !password || !name) {
      return { error: 'Email and password not provided' };
    }

    const passwordHash = sha256(password).toString();

    const user = await userModel.create({
      email,
      name,
      passwordHash
    });

    return createToken(user);
  }

  async login({ email, password }) {
    if (!email || !password) {
      return { error: 'Email and password not provided' };
    }

    const passHash = sha256(password).toString();

    const user = await userModel.findOne({ email });

    if (user) {
      if (user.passwordHash == passHash) {
        return createToken(user);
      }

      return { error: 'Password is not correct' };
    }

    return { error: 'User not found' };
  }

  async changePassword(user, { password }) {
    if (!password) {
      throw new Error('password not provided');
    }

    user.password = sha256(password).toString();
    user.save();
  }
}

module.exports = new AuthenticationController();