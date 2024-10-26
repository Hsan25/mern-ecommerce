import { JestConfigWithTsJest, } from "ts-jest";

const jestConfig: JestConfigWithTsJest = {
  preset: "ts-jest",
  moduleDirectories: ["node_modules", "<rootDir>"],
  testEnvironment: "node",
  rootDir: "./src",
  moduleNameMapper: {
    '^@config/(.*)$': '<rootDir>/config/$1',
    '^@controller/(.*)$': '<rootDir>/controller/$1',
    '^@model/(.*)$': '<rootDir>/model/$1',
    '^@service/(.*)$': '<rootDir>/service/$1',
  },
}

export default jestConfig;

