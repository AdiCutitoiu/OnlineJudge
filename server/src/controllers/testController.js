const testModel = require('../models/test');

class TestController {
  async list(problemId) {
    return await testModel.find({ id: problemId });
  }

  async getTest(testId) {
    return await testModel.findById(testId);
  }

  async createTest(problemId) {
    return await testModel.create({
      problem: problemId
    });
  }

  async deleteTest(testId) {
    return await testModel.findByIdAndDelete(testId);
  }

  async updateTest(testId) {
    return await testModel.findByIdAndUpdate(testId);
  }
}

module.exports = new TestController();