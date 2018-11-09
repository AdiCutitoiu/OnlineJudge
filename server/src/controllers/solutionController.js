const solutionModel = require('../models/solution');

class SolutionController {
  async addSolution({ problem, author, code }) {
    return solutionModel.create({
      problem: problem,
      author: author,
      code: code
    });
  }

  async getSolution(solutionId) {
    return solutionModel.findById(solutionId);
  }
}

module.exports = new SolutionController();