/** @type {import("eslint").Linter.Config} */
module.exports = {
  extends: ['@repo/eslint-config/next.js'],
  parserOptions: {
    project: true,
  },
  rules: {
    '@typescript-eslint/no-explicit-any': 0,
    '@next/next/no-img-element': 0,
  },
};
