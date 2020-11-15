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

class GlotRunner {
  async runCpp(code, input) {
    return this.run(CPP, code, input);
  }

  async runJavascript(code, input) {
    return this.run(JS, code, input);
  }

  async run(language, code, input) {
    const requestData = this.createRequestData(language, code, input);
    const res = await axios.post(
      `https://run.glot.io/languages/${language}/latest`,
      requestData
    );

    return res.data;
  }

  createRequestData(language, code, input) {
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
}

module.exports = new GlotRunner();
