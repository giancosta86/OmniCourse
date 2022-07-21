module.exports = {
  transform: {
    "^.+\\.(t|j)sx?$": ["@swc/jest"]
  },

  testPathIgnorePatterns: ["dist/"],
  coveragePathIgnorePatterns: [`/src/index.ts$`, `/components/`]
};
