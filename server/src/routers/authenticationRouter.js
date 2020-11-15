const express = require("express");
const authenticationController = require("../controllers/authenticationController");
const authorize = require("../middleware/authorize");

class AuthenticationRouter {
  constructor() {
    const router = express.Router();

    router.post("/login", this.onLogin);
    router.post("/register", this.onRegister);

    this.router = router;
  }

  onLogin = async (req, res, next) => {
    try {
      const result = await authenticationController.login(req.body);
      res.status(200).json(result);
    } catch (err) {
      next(err);
    }
  };

  onRegister = async (req, res, next) => {
    try {
      const result = await authenticationController.register(req.body);
      res.status(201).json(result);
    } catch (err) {
      next(err);
    }
  };
}

module.exports = new AuthenticationRouter();
