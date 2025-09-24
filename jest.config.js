module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/src', '<rootDir>/tests'],
  testMatch: ['**/__tests__/**/*.ts', '**/?(*.)+(spec|test).ts'],
  transform: {
    '^.+\\.ts$': [
      'ts-jest',
      {
        tsconfig: 'tsconfig.test.json',
      },
    ],
  },
  collectCoverageFrom: [
    'src/**/*.ts',
    '!src/**/*.d.ts',
    '!src/**/index.ts',
    '!src/**/*.test.ts',
    '!src/**/__tests__/**',
    '!**/node_modules/**',
    '!**/dist/**',
    '!**/coverage/**',
  ],
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov', 'html', 'json'],
  coverageThreshold: {
    global: {
      branches: 90,
      functions: 95,
      lines: 95,
      statements: 95,
    },
    './src/validators.ts': {
      branches: 90,
      functions: 100,
      lines: 90,
      statements: 90,
    },
    './src/enhanced-validators.ts': {
      branches: 100,
      functions: 100,
      lines: 100,
      statements: 100,
    },
    './src/dnssec.ts': {
      branches: 100,
      functions: 100,
      lines: 100,
      statements: 100,
    },
  },
  // Clear mocks between tests
  clearMocks: true,
};
