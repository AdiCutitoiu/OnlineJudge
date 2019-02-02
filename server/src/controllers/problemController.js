const problemModel = require('../models/problem');

class ProblemController {
  async listProblems() {
    return [
      {
        id: "1",
        name: "Lorem ipsum",
        difficulty: 4
      },
      {
        id: "2",
        name: "Lorem ipsum",
        difficulty: 3
      },
      {
        id: "3",
        name: "Lorem ipsum",
        difficulty: 2
      },
      {
        id: "4",
        name: "Lorem ipsum",
        difficulty: 2
      }
    ];
    /*
    return await problemModel
      .find({})
      .sort({ publishDate: -1 })
      .select('name difficulty');*/
  }
  async getProblem(id) {
    return await problemModel.findById(id);
  }
  async deleteProblem(id) {
    return await problemModel.findById(id).remove();
  }
}

module.exports = new ProblemController();
