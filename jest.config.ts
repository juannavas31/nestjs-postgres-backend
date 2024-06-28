import type { Config } from 'jest';

const config: Config = {
  verbose: true,
  moduleFileExtensions: [
    'js',
    'json',
    'ts',
  ],
  rootDir: '.',
  roots: [
    './src',
    './test',
  ],
  modulePaths: ['<rootDir>'],
  testRegex: '.*\\.spec\\.ts$',
  transform: {
    '^.+\\.(t|j)s$': 'ts-jest',
  },
  collectCoverageFrom: [
    '**/*.(t|j)s',
  ],
  coverageDirectory: '../coverage',
  testEnvironment: 'node',
  reporters: [
    'default',
    [
      'jest-junit',
      {
        outputDirectory: 'test-results',
        outputName: 'TESTS-unit.xml',
      },
    ],
  ],
  setupFiles: [
    './jestSetup.ts',
  ],
};

export default config;
