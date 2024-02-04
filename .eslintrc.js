module.exports = {
    env: {
      node: true,
      commonjs: true,
      es2021: true,
    },
    extends: "eslint:recommended",
    parserOptions: {
      ecmaVersion: "latest",
    },
    rules: {
      eqeqeq: "off",
      curly: "error",
      quotes: ["error", "single"],
      semi: ["error", "always"],
      "no-console": 0,
      "no-empty": 0,
      "no-irregular-whitespace": 0,
    },
  };
  