#!/usr/bin/env node

// Simple test script for the CLI
const { execSync } = require('child_process');
const path = require('path');

const cliPath = path.join(__dirname, '..', 'dist', 'cli.js');

console.log('Testing DNS Validator CLI...\n');

try {
  // Test 1: Help command
  console.log('1. Testing help command:');
  console.log(execSync(`node "${cliPath}" --help`, { encoding: 'utf8' }));

  // Test 2: Version command
  console.log('2. Testing version command:');
  console.log(execSync(`node "${cliPath}" --version`, { encoding: 'utf8' }));
} catch (error) {
  console.error('CLI test failed:', error.message);
  process.exit(1);
}

console.log('CLI tests completed successfully!');
