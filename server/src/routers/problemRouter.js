const express = require("express");
const problemController = require("../controllers/problemController");
const authorize = require("../middleware/authorize");

class ProblemRouter {
  constructor() {
    const router = express.Router();

    router.get("/", this.onList);
    router.post("/", authorize.moderator, this.onNew);
    router.get("/:id", this.onGetById);
    router.post("/:id/solutions/cpp", this.onSubmitCpp);
    router.post("/:id/solutions/javascript", this.onSubmitJs);

    this.router = router;
  }

  onList = async (req, res, next) => {
    try {
      const problems = await problemController.listProblems();
      res.json(problems);
    } catch (err) {
      next(err);
    }
  };

  onNew = async (req, res, next) => {
    try {
      const problem = await problemController.create(req.body);
      res.status(201).json(problem);
    } catch (err) {
      next(err);
    }
  };

  onGetById = async (req, res, next) => {
    try {
      const problem = await problemController.getProblem(req.params.id);

      if (problem) {
        res.json(problem);
      } else {
        res.status(404).end();
      }
    } catch (err) {
      next(err);
    }
  };

  onSubmitCpp = async (req, res, next) => {
    try {
      const result = await problemController.addSolution(
        req.user.id,
        req.params.id,
        req.body.code
      );

      res.status(201).json(result);
    } catch (err) {
      next(err);
    }
  };

  onSubmitJs = async (req, res, next) => {
    try {
      const result = await problemController.addJsSolution(
        req.user.id,
        req.params.id,
        req.body.code
      );

      res.status(201).json(result);
    } catch (err) {
      next(err);
    }
  };
}

module.exports = new ProblemRouter();
