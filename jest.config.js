/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",

  testRegex: "\\.test\\.tsx?$",

  collectCoverageFrom: ["src/**/*.ts"],
  coveragePathIgnorePatterns: [`/src/index.ts$`, `/components/`]
};
