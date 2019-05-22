const submissionModel = require('../models/submission');

class SubmissionController {
  async list() {
    return submissionModel
      .find({}, 'problem submitter submitDate result')
      .sort('-submitDate')

      .populate('submitter', 'email')
      .populate('problem', 'name');
  }

  async getSubmission(submissionId) {
    return submissionModel
      .findById(submissionId)
      .populate('submitter', 'email')
      .populate('problem', 'name');;
  }
}

module.exports = new SubmissionController();