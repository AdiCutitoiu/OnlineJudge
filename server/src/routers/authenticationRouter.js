const express = require("express");
const authenticationController = require("../controllers/authenticationController");
const authorize = require("../middleware/authorize");

class AuthenticationRouter {
  constructor() {
    const router = express.Router();

    router.post("/login", this._onLogin);
    router.post("/register", this._onRegister);

    this.router = router;
  }

  _onLogin = async (req, res, next) => {
    try {
      const result = await authenticationController.login(req.body);
      res.status(200).json(result);
    } catch (err) {
      next(err);
    }
  };

  _onRegister = async (req, res, next) => {
    try {
      const result = await authenticationController.register(req.body);
      res.status(201).json(result);
    } catch (err) {
      next(err);
    }
  };
}

module.exports = new AuthenticationRouter();
