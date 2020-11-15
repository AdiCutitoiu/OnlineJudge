const express = require("express");
const authorize = require("../middleware/authorize");
const userController = require("../controllers/userController");

class UserRouter {
  constructor() {
    const router = express.Router();

    router.get("/", this.onList);
    router.get("/profile", this.onProfile);
    router.put("/:id/promote", authorize.admin, this.onPromote);
    router.put("/:id/demote", authorize.admin, this.onDemote);

    this.router = router;
  }

  onList = async (req, res, next) => {
    try {
      res.json(await userController.list());
    } catch (err) {
      next(err);
    }
  };

  onProfile = async (req, res, next) => {
    try {
      res.json(await userController.getProfile(req.user.id));
    } catch (error) {
      next(err);
    }
  };

  onPromote = async (req, res, next) => {
    try {
      res.json(
        await userController.changePermissions(req.params.id, "Moderator")
      );
    } catch (err) {
      next(err);
    }
  };

  onDemote = async (req, res, next) => {
    try {
      res.json(await userController.changePermissions(req.params.id, "Normal"));
    } catch (err) {
      next(err);
    }
  };
}

module.exports = new UserRouter();
