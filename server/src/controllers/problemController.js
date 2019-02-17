const problemModel = require('../models/problem');
const config = require('../../config');

async function runSolution(id, code) {
  console.log(code);
  const data = {
    files: [{
      name: 'main.cpp',
      content: code
    }],
    command: '',
    stdin: ''
  };
  const response = await axios.post('https://run.glot.io/languages/cpp/latest', data);

  return response.data;
}

const problems = [
  {
    id: '1',
    name: 'Lorem ipsum',
    task: 'Lorem ipsumLorem ipsumLorem ipsumLorem ipsumLorem ipsumLorem ipsumLorem ipsumLorem ipsumLorem ipsum',
    inputDesc: 'Lorem ipsumLorem ipsumLorem ipsumLorem ipsumLorem ipsumLorem ipsumLorem ipsumLorem ipsumLorem ipsum',
    outputDesc: 'Lorem ipsumLorem ipsumLorem ipsumLorem ipsumLorem ipsumLorem ipsumLorem ipsumLorem ipsumLorem ipsum',
    difficulty: 4,
    examples: [{
      input: '3\n1 2 3',
      output: '6\n2\n3\n4',
    }, {
      input: '3\n1 2 3',
      output: '6\n2\n3\n4',
    }]
  },
  {
    id: '2',
    name: 'Lorem ipsum',
    task: 'Lorem ipsumLorem ipsumLorem ipsumLorem ipsumLorem ipsumLorem ipsumLorem ipsumLorem ipsumLorem ipsum',
    inputDesc: 'Lorem ipsumLorem ipsumLorem ipsumLorem ipsumLorem ipsumLorem ipsumLorem ipsumLorem ipsumLorem ipsum',
    outputDesc: 'Lorem ipsumLorem ipsumLorem ipsumLorem ipsumLorem ipsumLorem ipsumLorem ipsumLorem ipsumLorem ipsum',
    difficulty: 4,
    examples: [{
      input: '3\n1 2 3',
      output: '6',
    }]
  },
  {
    id: '3',
    name: 'Lorem ipsum',
    task: 'Lorem ipsumLorem ipsumLorem ipsumLorem ipsumLorem ipsumLorem ipsumLorem ipsumLorem ipsumLorem ipsum',
    inputDesc: 'Lorem ipsumLorem ipsumLorem ipsumLorem ipsumLorem ipsumLorem ipsumLorem ipsumLorem ipsumLorem ipsum',
    outputDesc: 'Lorem ipsumLorem ipsumLorem ipsumLorem ipsumLorem ipsumLorem ipsumLorem ipsumLorem ipsumLorem ipsum',
    difficulty: 4,
    examples: [{
      input: '3\n1 2 3',
      output: '6',
    }]
  },
  {
    id: '4',
    name: 'Lorem ipsum',
    task: 'Lorem ipsumLorem ipsumLorem ipsumLorem ipsumLorem ipsumLorem ipsumLorem ipsumLorem ipsumLorem ipsum',
    inputDesc: 'Lorem ipsumLorem ipsumLorem ipsumLorem ipsumLorem ipsumLorem ipsumLorem ipsumLorem ipsumLorem ipsum',
    outputDesc: 'Lorem ipsumLorem ipsumLorem ipsumLorem ipsumLorem ipsumLorem ipsumLorem ipsumLorem ipsumLorem ipsum',
    difficulty: 4,
    examples: [{
      input: '3\n1 2 3',
      output: '6',
    }]
  },
];

const axios = require('axios').create({
  headers: {
    Authorization: `Token ${config.glotToken}`,
    'Content-Type': 'application/json'
  }
})

class ProblemController {
  async listProblems() {
    return problems;
    /*
    return await problemModel
      .find({})
      .sort({ publishDate: -1 })
      .select('name difficulty');*/
  }
  async getProblem(id) {
    return problems[0];
    //return await problemModel.findById(id);
  }
  async deleteProblem(id) {
    return await problemModel.findById(id).remove();
  }
  async addSolution(id, code) {
    return runSolution(id, code);
  }
}

module.exports = new ProblemController();
