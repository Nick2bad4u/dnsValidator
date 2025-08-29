const typescript = require('@typescript-eslint/eslint-plugin');
const typescriptParser = require('@typescript-eslint/parser');

module.exports = [
  {
    // Base configuration for source files
    files: ['src/**/*.ts'],
    languageOptions: {
      parser: typescriptParser,
      parserOptions: {
        ecmaVersion: 2020,
        sourceType: 'module',
        project: './tsconfig.json',
        tsconfigRootDir: __dirname
      }
    },
    plugins: {
      '@typescript-eslint': typescript
    },
    rules: {
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          caughtErrorsIgnorePattern: '^_'
        }
      ],
      'no-console': 'error'
    }
  },
  {
    // Configuration for test files using test tsconfig
    files: ['tests/**/*.ts'],
    languageOptions: {
      parser: typescriptParser,
      parserOptions: {
        ecmaVersion: 2020,
        sourceType: 'module',
  // Use default inferred project for tests to avoid resolution issues on CI
  tsconfigRootDir: __dirname
      }
    },
    plugins: {
      '@typescript-eslint': typescript
    },
    rules: {
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          caughtErrorsIgnorePattern: '^_'
        }
      ],
      'no-console': 'off'  // Allow console usage in test files
    }
  },
  {
    // Allow console usage in CLI file
    files: ['src/cli.ts'],
    rules: {
      'no-console': 'off'
    }
  },
  {
    // Ignore dist and coverage directories
    ignores: ['dist/**', 'coverage/**', 'node_modules/**']
  }
];
