module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module',
  },
  plugins: ['@typescript-eslint'],
  extends: ['eslint:recommended'],
  rules: {
    // Disable conflicting rules
    'no-unused-vars': 'off',
    'no-undef': 'off',

    // Basic rules
    'no-console': 'off',
    'prefer-const': 'error',
    'no-var': 'error',

    // TypeScript rules
    '@typescript-eslint/no-unused-vars': [
      'error',
      { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
    ],
  },
  env: {
    node: true,
    es6: true,
    jest: true,
  },
  overrides: [
    {
      // Allow console in CLI and test files
      files: ['src/cli.ts', 'tests/**/*.ts', '**/*.test.ts'],
      rules: {
        'no-console': 'off',
      },
    },
  ],
  ignorePatterns: [
    'node_modules/',
    'dist/',
    'coverage/',
    '*.js',
    '!.eslintrc.js',
  ],
};
