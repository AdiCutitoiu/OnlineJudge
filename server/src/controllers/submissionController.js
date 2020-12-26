const submissionModel = require("../models/submission");

class SubmissionController {
  async list() {
    return submissionModel
      .find({}, "-code")
      .sort("-submitDate")
      .populate("submitter", "name")
      .populate("problem", "name");
  }

  async getSubmission(submissionId) {
    return submissionModel
      .findById(submissionId)
      .populate("submitter", "name")
      .populate("problem", "name");
  }
}

module.exports = new SubmissionController();
