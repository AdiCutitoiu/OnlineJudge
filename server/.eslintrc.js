module.exports = {
  env: {
    browser: true,
    commonjs: true,
    es2021: true,
  },
  parser: "babel-eslint",
  parserOptions: {
    ecmaVersion: 12,
  },
  ignorePatterns: [".eslint.js"],
  rules: {
    "comma-dangle": ["error", "always-multiline"],
    "eol-last": ["error", "always"],
    complexity: ["error", 7],
    indent: ["error", 2],
    "linebreak-style": ["error", "unix"],
    "max-len": ["error", 60],
    "max-lines-per-function": ["error", 20],
    quotes: ["error", "double"],
    "no-unreachable": "error",
    "no-unused-expressions": "error",
    "no-unused-vars": "error",
  },
};
