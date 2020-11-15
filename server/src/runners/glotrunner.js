const config = require("../../config");
const HttpException = require("../exceptions/httpException");

const axios = require("axios").create({
  headers: {
    Authorization: `Token ${config.glotToken}`,
    "Content-Type": "application/json",
  },
});

const JS = "javascript";
const CPP = "cpp";

function createRequestData(language, code, input) {
  if (language === CPP) {
    return {
      files: [
        {
          name: "main.cpp",
          content: code,
        },
      ],
      command: "",
      stdin: input,
    };
  } else if (language === JS) {
    return {
      files: [
        {
          name: "main.js",
          content: code,
        },
      ],
      command: "",
      stdin: input,
    };
  }

  throw new HttpException(400, "Language not supported");
}

async function run(language, code, input) {
  const requestData = createRequestData(language, code, input);
  const res = await axios.post(
    `https://run.glot.io/languages/${language}/latest`,
    requestData
  );

  return res.data;
}

class GlotRunner {
  async runCpp(code, input) {
    return run(CPP, code, input);
  }

  async runJavascript(code, input) {
    return run(JS, code, input);
  }
}

module.exports = GlotRunner;
