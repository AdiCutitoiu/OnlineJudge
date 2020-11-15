const express = require("express");
const controller = require("../controllers/articleController");
const authorize = require("../middleware/authorize");

const router = express.Router();

class ArticleRouter {
  constructor() {
    this.router = express.Router();

    this.router.get("/", this.onList);
    this.router.post("/", authorize.moderator, this.onNew);
    this.router.get("/:id", this.onGetById);
  }

  onList = async (req, res, next) => {
    try {
      res.json(await controller.list());
    } catch (error) {
      next(error);
    }
  };

  onNew = async (req, res, next) => {
    try {
      res.status(201).json(await controller.create(req.body));
    } catch (error) {
      next(error);
    }
  };

  onGetById = async (req, res, next) => {
    try {
      res.json(await controller.get(req.params.id));
    } catch (error) {
      next(error);
    }
  };
}

module.exports = new ArticleRouter();
