const express = require("express");
const controller 
  = require("../controllers/articleController");
const authorize = require("../middleware/authorize");

class ArticleRouter {
  constructor() {
    this.router = express.Router();

    this.router.get("/", this._onList);
    this.router.post("/", authorize.moderator, this._onNew);
    this.router.get("/:id", this._onGetById);
  }

  _onList = async (req, res, next) => {
    try {
      res.json(await controller.list());
    } catch (error) {
      next(error);
    }
  };

  _onNew = async (req, res, next) => {
    try {
      const result = await controller.create(req.body);
      res.status(201).json(result);
    } catch (error) {
      next(error);
    }
  };

  _onGetById = async (req, res, next) => {
    try {
      res.json(await controller.get(req.params.id));
    } catch (error) {
      next(error);
    }
  };
}

module.exports = new ArticleRouter();
