const config = require("../../config");
const Exception = require("../exceptions/httpException");

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
    return this._run(CPP, code, input);
  }

  async runJavascript(code, input) {
    return this._run(JS, code, input);
  }

  async _run(language, code, input) {
    const body = this._makeBody(language, code, input);
    const res = await axios.post(
      `https://run.glot.io/languages/${language}/latest`,
      body,
    );

    return res.data;
  }

  _makeBody(language, code, input) {
    const result = {
      files: [
        {
          name: "main.cpp",
          content: code,
        },
      ],
      command: "",
      stdin: input,
    };

    if (![CPP, JS].includes(language))
      throw new Exception(400, "Language not supported");

    const file = result.files[0];
    file.name = language === CPP ? "main.cpp" : "main.js";
    return result;
  }
}

module.exports = new GlotRunner();
