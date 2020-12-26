const express = require("express");
const authorize = require("../middleware/authorize");
const userController 
  = require("../controllers/userController");

class UserRouter {
  constructor() {
    const router = express.Router();

    router.get("/", this._onList);
    router.get("/profile", this._onProfile);
    router.put("/:id/promote", 
      authorize.admin, 
      this._onPromote,
    );
    router.put("/:id/demote", 
      authorize.admin, 
      this._onDemote,
    );

    this.router = router;
  }

  _onList = async (req, res, next) => {
    try {
      res.json(await userController.list());
    } catch (err) {
      next(err);
    }
  };

  _onProfile = async (req, res, next) => {
    try {
      const { id } = req.user;
      res.json(await userController.getProfile(id));
    } catch (error) {
      next(err);
    }
  };

  _onPromote = async (req, res, next) => {
    try {
      const { id } = req.user;
      const role = "Moderator";
      res.json(await userController.changePerms(id, role));
    } catch (err) {
      next(err);
    }
  };

  _onDemote = async (req, res, next) => {
    try {
      const { id } = req.user;
      const role = "Normal";
      res.json(await userController.changePerms(id, role));
    } catch (err) {
      next(err);
    }
  };
}

module.exports = new UserRouter();
