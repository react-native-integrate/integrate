const esModules = require('./esModules');
const { join } = require('path');
module.exports = {
  preset: 'ts-jest',
  prettierPath: require.resolve('prettier-2'),
  testEnvironment: 'node',
  testMatch: ['**/__tests__/**/*.spec.ts'],
  transform: {
    '^.+\\.(js|jsx|ts|tsx|mjs|cjs)$': ['ts-jest',{
      tsconfig: './tsconfig.json',
      isolatedModules: true,
    }]
  },
  collectCoverageFrom: [
    '<rootDir>/src/**/*.ts',
    '!<rootDir>/src/__tests__/**/*.ts',
    '!<rootDir>/src/types/**/*.ts',
    '!<rootDir>/src/cli.ts',
  ],
  collectCoverage: true,
  transformIgnorePatterns: [
      `node_modules/(?!.pnpm)(?!(${esModules.join('|')})/)`,
  ],
  moduleNameMapper: {
    // Force module unicorn-magic to resolve with the CJS entry point, because Jest does not support package.json.exports
    "unicorn-magic": require.resolve('unicorn-magic'),
    "prettier": require.resolve('prettier-2'),
  },
};
