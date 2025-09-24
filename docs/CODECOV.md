# Code Coverage with Codecov

This document explains the code coverage setup for the DNS Validator project using Codecov and GitHub Actions.

## Overview

The project uses the following tools for code coverage:

- **Jest** - Test framework and coverage generation
- **Codecov** - Coverage reporting and tracking
- **GitHub Actions** - Automated CI/CD and coverage upload

## Configuration Files

### Jest Configuration (`jest.config.js`)

The Jest configuration includes:

- Coverage collection from all `src/**/*.ts` files
- Multiple output formats: `text`, `lcov`, `html`, `json`
- Coverage thresholds for different components
- Exclusion of test files and build artifacts

### Codecov Configuration (`codecov.yml`)

The Codecov configuration includes:

- Coverage targets: 85% project, 80% patch
- Component-based tracking for different modules
- File and path ignoring rules
- PR comment layout configuration
- Flag-based coverage tracking

### GitHub Actions (`ci.yml`)

The GitHub Actions workflow:

- Runs on Ubuntu 18.x for coverage uploads
- Uses Codecov Action v5 with OIDC authentication
- Uploads LCOV coverage reports
- Includes proper error handling

## Coverage Components

The project tracks coverage for different components:

1. **Core Validators** (`validators.ts`, `enhanced-validators.ts`)
2. **DNSSEC Support** (`dnssec.ts`, `dnssec-validators.ts`)
3. **CLI Tool** (`cli.ts`)
4. **Utilities** (`utils.ts`, `types.ts`, `performance.ts`)
5. **Error Handling** (`errors.ts`)

## Coverage Thresholds

### Global Thresholds

- Statements: 95%
- Branches: 95%
- Functions: 95%
- Lines: 95%

### File-Specific Thresholds

- **Core Validators**: 90% (due to complex validation logic)
- **Enhanced Validators**: 100% (advanced features)
- **DNSSEC Modules**: 100% (security-critical code)

## Running Coverage Locally

### Generate Coverage Report

```bash
npm run test:coverage
```

### View HTML Report

```bash
# Windows
start coverage/lcov-report/index.html

# macOS
open coverage/lcov-report/index.html

# Linux
xdg-open coverage/lcov-report/index.html
```

### Check Coverage Thresholds

Jest will automatically fail if coverage falls below the configured thresholds.

## CI/CD Integration

### Coverage Upload Process

1. Tests run in GitHub Actions on Ubuntu 18.x
2. Jest generates LCOV coverage report
3. Codecov Action v5 uploads the report
4. Codecov processes and displays coverage data

### OIDC Authentication

The setup uses OpenID Connect (OIDC) for secure authentication to Codecov without requiring manual token management for public repositories.

### Coverage Flags

- `unittests` - All unit test coverage
- Component-specific flags for targeted tracking

## Codecov Features

### PR Comments

Codecov automatically comments on pull requests with:

- Coverage diff from base branch
- File-by-file coverage changes
- Overall project coverage status

### Status Checks

- **Project Coverage**: Must maintain 85% overall coverage
- **Patch Coverage**: New code must have 80% coverage

### Component Tracking

Each major module is tracked separately, allowing for:

- Component-specific coverage goals
- Focused coverage improvement efforts
- Better visibility into module health

## Best Practices

### Writing Tests for Coverage

1. **Test Happy Paths**: Cover normal execution flows
2. **Test Error Cases**: Include error handling and edge cases
3. **Test Branch Logic**: Ensure all conditional branches are covered
4. **Mock External Dependencies**: Use Jest mocks for external services

### Maintaining High Coverage

1. Write tests before or alongside new code
2. Review coverage reports in PRs
3. Focus on critical business logic first
4. Use coverage gaps to identify untested scenarios

### Coverage vs Quality

- High coverage doesn't guarantee bug-free code
- Focus on meaningful test cases over coverage percentage
- Use coverage as a tool to find untested code paths
- Combine with other quality measures (linting, type checking)

## Troubleshooting

### Coverage Not Uploading

1. Check GitHub Actions logs for upload errors
2. Verify OIDC permissions are configured
3. Ensure LCOV report is generated correctly

### Thresholds Failing

1. Run `npm run test:coverage` locally
2. Review the coverage report to identify gaps
3. Add tests for uncovered lines/branches
4. Consider adjusting thresholds if they're unrealistic

### Codecov Configuration Errors

1. Validate `codecov.yml` using: `curl --data-binary @codecov.yml https://codecov.io/validate`
2. Check for YAML syntax errors
3. Review Codecov documentation for valid configuration options

## Resources

- [Codecov Documentation](https://docs.codecov.io/)
- [Jest Coverage Configuration](https://jestjs.io/docs/configuration#coverage-configuration-options)
- [GitHub Actions Codecov Action](https://github.com/marketplace/actions/codecov)
- [OIDC Authentication](https://docs.codecov.io/docs/github-oidc)
