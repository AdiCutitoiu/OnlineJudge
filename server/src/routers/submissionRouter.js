const express = require("express");
const submissionController = require("../controllers/submissionController");

class SubmissionRouter {
  constructor() {
    const router = express.Router();

    router.get("/", this._onList);
    router.get("/:id", this._onGetById);

    this.router = router;
  }

  _onList = async (req, res, next) => {
    try {
      const submissions = await submissionController.list();
      res.json(submissions);
    } catch (err) {
      next(err);
    }
  };

  _onGetById = async (req, res, next) => {
    try {
      const submission = await submissionController.getSubmission(
        req.params.id
      );
      if (!submission) {
        return res.status(404).end();
      }

      return res.json(submission);
    } catch (err) {
      next(err);
    }
  };
}

module.exports = new SubmissionRouter();
