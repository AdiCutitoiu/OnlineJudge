const express = require("express");
const submissionController = require("../controllers/submissionController");

class SubmissionRouter {
  constructor() {
    const router = express.Router();

    router.get("/", this.onList);
    router.get("/:id", this.onGetById);

    this.router = router;
  }

  onList = async (req, res, next) => {
    try {
      const submissions = await submissionController.list();
      res.json(submissions);
    } catch (err) {
      next(err);
    }
  };

  onGetById = async (req, res, next) => {
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
