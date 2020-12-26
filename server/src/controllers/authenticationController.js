const jwt = require("jsonwebtoken");
const userModel = require("../models/user");
const sha256 = require("crypto-js/sha256");
const HttpException 
  = require("../exceptions/httpException");
const UserNotFoundException 
  = require("../exceptions/userNotFoundException");
const config = require("../../config");

function createToken({ id, role, name }) {
  return {
    token: jwt.sign({ id }, config.secret),
    role,
    name,
  };
}

const CREDENTIALS_ERR_MSG = "Credentials not provided";

class AuthenticationController {
  async initializeAdmin({ email, password }) {
    let admin = await userModel.findOne({ role: "Admin" });

    if (!email || !password) {
      throw new HttpException(400, CREDENTIALS_ERR_MSG);
    }

    if (!admin) {
      admin = new userModel({
        email,
        passwordHash: sha256(password).toString(),
        name: "Admin",
        role: "Admin",
      });

      await admin.save();
    }
  }

  async register({ email, password, name }) {
    if (!email || !password || !name) {
      throw new HttpException(400, CREDENTIALS_ERR_MSG);
    }

    const passwordHash = sha256(password).toString();

    const user = await userModel.create({
      email,
      name,
      passwordHash,
    });

    return createToken(user);
  }

  async login({ email, password }) {
    if (!email || !password) {
      throw new HttpException(400, CREDENTIALS_ERR_MSG);
    }

    const passHash = sha256(password).toString();

    const user = await userModel.findOne({ email });

    if (user) {
      if (user.passwordHash == passHash) {
        return createToken(user);
      }

      throw new HttpException(400, "Wrong password");
    }

    throw new UserNotFoundException();
  }
}

module.exports = new AuthenticationController();
