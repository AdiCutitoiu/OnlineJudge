const problemModel = require('../models/problem');
const submissionModel = require('../models/submission');
const HttpException = require('../exceptions/httpException');
const runner = require('../runners/runner');

function addJSTimer(code) {
  return `
  function _main() {
    ${code};
  }

  process.on('exit', function() {
    const start = process.cpuUsage().user;
    return () => {
        const res = Math.ceil((process.cpuUsage().user - start) / 1000);
        console.log(res);
    };
  }());
  process.stdin.setEncoding('utf8');

  _main();
  `;
}

function addCPPTimer(code) {
  const CPP_TIMER = `
#ifdef _WIN32

#include <iostream>
#include <Windows.h>
namespace CounterDetail
{
  struct _Counter {
    HANDLE mProcess;
    unsigned long long mStart;

    _Counter()
      : mProcess{ ::GetCurrentProcess() }
      , mStart{ GetTime() }
    {
    }

    ~_Counter()
    {
      std::cout << std::endl << GetTime() - mStart;
    }

    unsigned long long GetTime()
    {
      FILETIME creationTime;
      FILETIME endTime;
      FILETIME kernelTime;
      FILETIME userTime;
      ::GetProcessTimes(mProcess, &creationTime, &endTime, &kernelTime, &userTime);

      unsigned long long timeInHundredNs = userTime.dwHighDateTime;
      timeInHundredNs <<= 32;
      timeInHundredNs |= userTime.dwLowDateTime;

      // 1ms = 1.000.000 ns = 10.000 * 100 ns
      return timeInHundredNs / 10'000;
    }
  } _counter;
}
#endif

#ifdef __unix__

#include <iostream>
#include <sys/times.h>
namespace CounterDetail
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
#endif
`;

  return code + CPP_TIMER;
}

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
  while (remaining.length && remaining[remaining.length - 1].trim() === '') {
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

async function runSolution(code, tests, codeRunner) {

  const pendingResults = tests.map(test => codeRunner(code, test.input));
  const responses = (await Promise.all(pendingResults));
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

  async create(problemData) {
    if (!problemData.tests || !problemData.tests.length) {
      throw new HttpException(400, 'No tests provided');
    }

    const malformedTest = problemData.tests.find(test => !test.input || !test.output);
    if (malformedTest) {
      throw new HttpException(400, `Test ${problemData.tests.indexOf(malformedTest) + 1} is malformed`);
    }

    return await problemModel.create(problemData);
  }

  async getProblem(id) {
    return await problemModel.findById(id);
  }

  async deleteProblem(id) {
    return await problemModel.findById(id).remove();
  }

  async addSolution(userId, problemId, code) {
    const problem = await problemModel.findOne({ _id: problemId });

    const result = await runSolution(addCPPTimer(code), problem.tests, async (code, input) => {
      return runner.runCpp(code, input);
    });

    if (result.error) {
      const submission = new submissionModel({
        problem: problemId,
        submitter: userId,
        language: 'C++',
        code,
        submitDate: Date.now(),
        result: 'Compilation error'
      });
      await submission.save();

      return result;
    }

    const passedTests = result.tests.filter(test => test.pass);

    const submission = new submissionModel({
      problem: problemId,
      submitter: userId,
      language: 'C++',
      code,
      submitDate: Date.now(),
      result: passedTests.length === result.tests.length ? 'Pass' : 'Fail'
    });
    await submission.save();

    return result;
  }

  async addJsSolution(userId, problemId, code) {
    const problem = await problemModel.findOne({ _id: problemId });

    const result = await runSolution(addJSTimer(code), problem.tests, async (code, input) => {
      return runner.runJavascript(code, input)
    });

    if (result.error) {
      const submission = new submissionModel({
        problem: problemId,
        submitter: userId,
        language: 'JavaScript',
        code,
        submitDate: Date.now(),
        result: 'Compilation error'
      });
      await submission.save();

      return result;
    }

    const passedTests = result.tests.filter(test => test.pass);

    const submission = new submissionModel({
      problem: problemId,
      submitter: userId,
      language: 'JavaScript',
      code,
      submitDate: Date.now(),
      result: passedTests.length === result.tests.length ? 'Pass' : 'Fail'
    });
    await submission.save();

    return result;
  }
}

module.exports = new ProblemController();
