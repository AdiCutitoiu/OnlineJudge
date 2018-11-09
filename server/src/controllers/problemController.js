const problemModel = require('../models/problem');

class ProblemController {
  async listProblems() {
    return await problemModel
      .find({})
      .sort({ publishDate: -1 })
      .select('name');
  }
  async getProblem(id) {
    return await problemModel.findById(id);
  }
  async deleteProblem(id) {
    return await problemModel.findById(id).remove();
  }
}

module.exports = new ProblemController();