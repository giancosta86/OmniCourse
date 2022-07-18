module.exports = {
  transform: {
    "^.+\\.(t|j)sx?$": ["@swc/jest"]
  },

  testRegex: "\\.test\\.tsx?$",

  collectCoverageFrom: ["src/**/*.ts"],
  coveragePathIgnorePatterns: [`/src/index.ts$`, `/components/`]
};
