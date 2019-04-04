const problemModel = require('../models/problem');
const config = require('../../config');

const axios = require('axios').create({
  headers: {
    Authorization: `Token ${config.glotToken}`,
    'Content-Type': 'application/json'
  }
});

const INCLUDES = `#include <iostream>
#include <sys/times.h>
`;

const TIMER = `namespace _Detail
{
struct _Counter {
    clock_t start;
    
    _Counter() {
        tms t;
        times(&t);
        start = t.tms_utime;
    }
    
    ~_Counter() {
        tms t;
        times(&t);
        std::cout << std::endl << t.tms_utime - start;
    }
} _counter;
}
`;

function getLines(text) {
  return text
    .trim()
    .split('\n')
    .map(x => x.trim())
}

function separate(output) {
  const lines = getLines(output);

  const time = parseInt(lines[lines.length - 1])

  let remaining = lines;
  remaining.pop();
  while(remaining.length && remaining[remaining.length - 1].trim() === '') {
    remaining.pop();
  }

  return {
    time,
    output: remaining.join('').trim()
  };
}

async function compareOutput(received, expected) {
  const result = separate(received);

  const expectedLines = getLines(expected);
  const receivedLines = getLines(result.output);

  let pass = true;
  if (expectedLines.length != receivedLines.length) {
    pass = false;
  } else {
    for (let i = 0; i < expectedLines.length && pass; i++) {
      if (expectedLines[i] !== receivedLines[i]) {
        pass = false;
      }
    }
  }

  return {
    time: result.time,
    pass
  };
}

async function runSolution(id, code, tests) {

  const requestsData = tests.map(test => {
    return {
      files: [{
        name: 'main.cpp',
        content: INCLUDES + code + TIMER
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

class ProblemController {
  async listProblems() {
    return await problemModel.find({}).select('id name task');
  }
  async newProblem(problemData) {
    if (!problemData.tests) {
      throw new Error('No tests');
    }

    const malformedTest = problemData.tests.find(test => !test.input || !test.output);
    if (malformedTest) {
      throw new Error(`Test ${problemData.tests.indexOf(malformedTest) + 1} is malformed`);
    }

    const goodTests = problemData

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
