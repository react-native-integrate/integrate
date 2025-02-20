module.exports = {
  preset: 'ts-jest',
  prettierPath: require.resolve('prettier-2'),
  testEnvironment: 'node',
  testMatch: ['**/__tests__/**/*.spec.ts'],
  transform: {
    '^.+\\.spec\\.ts$': ['ts-jest',{
      diagnostics: false,
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
};
