const problemModel = require("../models/problem");
const submissionModel = require("../models/submission");
const Exception = require("../exceptions/httpException");
const runner = require("../runners/glotrunner");

function addJSTimer(code) {
  return `
  function _main() {
    ${code};
  }

  process.on('exit', function() {
    const start = process.cpuUsage().user;
    return () => {
        const rawTime = (process.cpuUsage().user - start)
        const res = Math.ceil(rawTime / 1000);
        console.log(res);
    };
  }());
  process.stdin.setEncoding('utf8');

  _main();
  `;
}
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
      ::GetProcessTimes(
        mProcess, 
        &creationTime, 
        &endTime, 
        &kernelTime, 
        &userTime
      );

      unsigned long long tTotal = userTime.dwHighDateTime;
      tTotal <<= 32;
      tTotal |= userTime.dwLowDateTime;

      // 1ms = 1.000.000 ns = 10.000 * 100 ns
      return tTotal / 10'000;
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

function addCPPTimer(code) {
  return code + CPP_TIMER;
}

function getLines(text) {
  return text
    .trim()
    .split("\n")
    .map((x) => x.trim());
}

function separate(output) {
  const lines = getLines(output);

  const time = parseInt(lines[lines.length - 1]);

  let remaining = lines;
  remaining.pop();

  return {
    time,
    output: remaining.join("").trim(),
  };
}

function compareLines(expectedLines, receivedLines) {
  for (let i = 0; i < expectedLines.length && pass; i++) {
    if (expectedLines[i] !== receivedLines[i]) {
      return false;
    }
  }

  return true;
}

async function compareOutput(received, expected) {
  const result = separate(received);

  const expectedLines = getLines(expected);
  const receivedLines = getLines(result.output);

  let pass = true;
  if (expectedLines.length != receivedLines.length) {
    pass = false;
  } else {
    if (!compareLines(expectedLines, receivedLines)) {
      pass = false;
    }
  }

  return {
    time: result.time,
    pass,
  };
}

async function runSolution(code, tests, codeRunner) {
  const pendingResults = tests.map((test) => {
    return codeRunner(code, test.input);
  });
  const responses = await Promise.all(pendingResults);
  if (responses[0].stderr.length) {
    return { error: responses[0].stderr };
  }

  const outputs = responses.map((data) => data.stdout);

  const comparisons = await Promise.all(
    Array.from(outputs, (output, index) => {
      return compareOutput(output, tests[index].output);
    }),
  );

  return { tests: comparisons };
}

class ProblemController {
  async listProblems() {
    return await problemModel
      .find({})
      .select("id name task");
  }

  async create(problemData) {
    if (!problemData.tests || !problemData.tests.length) {
      throw new Exception(400, "No tests provided");
    }

    const malformedTest = problemData.tests.find(
      (test) => !test.input || !test.output,
    );
    if (malformedTest) {
      const idx = problemData.tests.indexOf(malformedTest);
      const msg = `Test ${idx + 1} is malformed`;
      throw new Exception(400, msg);
    }

    return await problemModel.create(problemData);
  }

  async getProblem(id) {
    return await problemModel.findById(id, "-tests");
  }

  async deleteProblem(id) {
    return await problemModel.findById(id).remove();
  }

  _runCpp(code, tests) {
    const codeRunner = async (code, input) => {
      return runner.runCpp(code, input);
    };
    const timerCode = addCPPTimer(code);
    return runSolution(timerCode, tests, codeRunner);
  }

  _runJs(code, tests) {
    const codeRunner = async (code, input) => {
      return runner.runJavascript(code, input);
    };
    const timerCode = addJSTimer(code);
    return runSolution(timerCode, tests, codeRunner);
  }

  _newCppSubmission({ problemId, userId, code }) {
    return new submissionModel({
      problem: problemId,
      submitter: userId,
      language: "C++",
      code,
      submitDate: Date.now(),
      result: "Compilation error",
    });
  }

  _newJsSubmission({ problemId, userId, code }) {
    const submission = this._newCppSubmission({
      problemId,
      userId,
      code,
    });

    submission.language = "JavaScript";

    return submission;
  }

  async addSolution(userId, problemId, code) {
    const _id = problemId;
    const problem = await problemModel.findOne({ _id });
    const result = await this._runCpp(code, problem.tests);
    const submission = this._newCppSubmission({
      problemId,
      userId,
      code,
    });

    if (!result.error) {
      const passed = result.tests.filter((t) => t.pass);
      const success = passed.length === result.tests.length;
      submission.result = success ? "Pass" : "Fail";
    }

    await submission.save();
    return result;
  }

  async addJsSolution2(userId, problemId, code) {
    const _id = problemId;
    const problem = await problemModel.findOne({ _id });
    const result = await this._runJs(code, problem.tests);
    const submission = this._newJsSubmission({
      problemId,
      userId,
      code,
    });

    if (!result.error) {
      const passed = result.tests.filter((t) => t.pass);
      const success = passed.length === result.tests.length;
      submission.result = success ? "Pass" : "Fail";
    }

    await submission.save();
    return result;
  }
}

module.exports = new ProblemController();
