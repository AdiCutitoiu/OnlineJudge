const problemModel = require('../models/problem');
const config = require('../../config');

function getLines(text) {
  return text
    .trim()
    .split('\n')
    .map(x => x.trim())
}

async function compareOutput(expected, received) {
  const expectedLines = getLines(expected);
  const receivedLines = getLines(received);

  if (expectedLines.length != receivedLines.length) {
    return false;
  }

  for (let i = 0; i < expectedLines.length; i++) {
    if (expectedLines[i] !== receivedLines[i]) {
      return false;
    }
  }

  return true;
}

async function runSolution(id, code, tests) {

  const requestsData = tests.map(test => {
    return {
      files: [{
        name: 'main.cpp',
        content: code
      }],
      command: '',
      stdin: test.input
    };
  });

  const requests = requestsData.map(requestData => axios.post('https://run.glot.io/languages/cpp/latest', requestData));

  const responses = (await Promise.all(requests)).map(response => response.data);
  if (responses[0].stderr.length) {
    return { error: responses[0].stderr };
  }

  const outputs = responses.map(data => data.stdout);

  const comparisons = await Promise.all(Array.from(outputs, (output, index) => {
    return compareOutput(output, tests[index].output);
  }));

  return { tests: comparisons };
}

const axios = require('axios').create({
  headers: {
    Authorization: `Token ${config.glotToken}`,
    'Content-Type': 'application/json'
  }
})

class ProblemController {
  async listProblems() {
    return await problemModel.find({}).select('id name task');
  }
  async newProblem(problemData) {
    return await problemModel.create(problemData);
  }
  async getProblem(id) {
    return await problemModel.findById(id);
  }
  async deleteProblem(id) {
    return await problemModel.findById(id).remove();
  }
  async addSolution(id, code) {
    const problem = await problemModel.findOne({ _id: id });

    return runSolution(id, code, problem.tests);
  }
}

module.exports = new ProblemController();
