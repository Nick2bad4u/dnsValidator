import { runCLI } from '../src/cli';
import * as fs from 'fs';

// Helper to capture console output and avoid actual process.exit terminating tests
function captureRun(args: string[]): {
  code: number;
  stdout: string;
  stderr: string;
} {
  const originalLog = console.log;
  const originalError = console.error;
  const originalExit = process.exit;
  let stdout = '';
  let stderr = '';
  let code: number | undefined;
  (console as any).log = (msg?: any, ...rest: any[]) => {
    stdout += [msg, ...rest].filter(v => v !== undefined).join(' ') + '\n';
  };
  (console as any).error = (msg?: any, ...rest: any[]) => {
    stderr += [msg, ...rest].filter(v => v !== undefined).join(' ') + '\n';
  };
  (process as any).exit = (c?: number) => {
    code = c === undefined ? 0 : c;
  };
  try {
    runCLI(args);
  } finally {
    console.log = originalLog;
    console.error = originalError;
    (process as any).exit = originalExit as any;
  }
  return { code: code === undefined ? 0 : code, stdout, stderr };
}

describe('CLI extra branches', () => {
  test('record unknown type non-strict warns not error', () => {
    const data = JSON.stringify({ name: 'x', value: 'y' });
    const res = captureRun(['record', '--data', data, '--type', 'ZZZ']);
    expect(res.code).toBe(0); // success path because not strict
    expect(res.stdout).toContain('ZZZ');
    expect(res.stdout).toMatch(/Unknown record type/);
  });

  test('record strict invalid structure exits with error', () => {
    const data = JSON.stringify({});
    const res = captureRun([
      'record',
      '--data',
      data,
      '--type',
      'A',
      '--strict',
    ]);
    expect(res.code).toBe(1);
    expect(res.stdout).toContain('Invalid A record structure');
  });

  test('record strict unsupported type exits with invalid structure error (falls through basic validation first)', () => {
    const data = JSON.stringify({});
    const res = captureRun([
      'record',
      '--data',
      data,
      '--type',
      'UNSUPPORTED',
      '--strict',
    ]);
    expect(res.code).toBe(1);
    // Structure invalid triggers generic invalid structure error for the provided type
    expect(res.stdout).toContain('Invalid UNSUPPORTED record structure');
  });

  test('record csv output formatting and quote escaping', () => {
    const data = JSON.stringify({ type: 'TXT', entries: ['a"b'] });
    const res = captureRun(['record', '--data', data, '--format', 'csv']);
    expect(res.stdout.split('\n')[0]).toContain('Type');
    // CSV escaping of quotes -> doubled inside JSON string, look for escaped sequence
    expect(res.stdout).toMatch(/a\\""b|a""b/);
  });

  test('record table output truncation', () => {
    const longTxt = 'x'.repeat(120);
    const data = JSON.stringify({ type: 'TXT', entries: [longTxt] });
    const res = captureRun(['record', '--data', data, '--format', 'table']);
    // Should contain table separators and ellipsis due to substring + '...'
    expect(res.stdout).toContain('|');
    expect(res.stdout).toContain('...');
  });

  test('query path missing input triggers error exit', () => {
    const res = captureRun(['query']);
    expect(res.code).toBe(1);
    expect(res.stderr).toMatch(/Must provide either --data or --file/);
  });

  test('bulk missing file option exits', () => {
    const res = captureRun(['bulk']);
    expect(res.code).toBe(1);
    expect(res.stderr).toMatch(/Must provide --file option/);
  });

  test('bulk non-array JSON exits', () => {
    const file = 'tmp-non-array.json';
    fs.writeFileSync(file, JSON.stringify({ not: 'array' }));
    const res = captureRun(['bulk', '--file', file]);
    fs.unlinkSync(file);
    expect(res.code).toBe(1);
    expect(res.stderr).toMatch(/must contain a JSON array/);
  });

  test('bulk queries mode with mixed success still exercises summary reporting branch', () => {
    const file = 'tmp-queries.json';
    const validQuery = {
      question: { name: 'example.com', type: 'A', class: 'IN' },
      answers: [
        { type: 'A', name: 'example.com', address: '1.2.3.4', ttl: 10 },
      ],
    };
    // Invalid: missing answers entirely
    const invalidQuery = {
      question: { name: 'example.com', type: 'A', class: 'IN' },
    } as any;
    fs.writeFileSync(file, JSON.stringify([validQuery, invalidQuery]));
    const res = captureRun(['bulk', '--file', file, '--mode', 'queries']);
    fs.unlinkSync(file);
    // Depending on validation internals failure may not set exit code; ensure summary printed
    expect(res.stderr).toMatch(/Summary:/);
  });

  test('bulk records output to file path', () => {
    const file = 'tmp-bulk-output.json';
    const out = 'tmp-bulk-results.txt';
    fs.writeFileSync(file, JSON.stringify([{ type: 'A', address: '1.2.3.4' }]));
    const res = captureRun([
      'bulk',
      '--file',
      file,
      '--output',
      out,
      '--format',
      'json',
    ]);
    expect(res.stdout).toMatch(/Results written to/);
    const content = fs.readFileSync(out, 'utf8');
    expect(content).toMatch(/"success"/);
    fs.unlinkSync(file);
    fs.unlinkSync(out);
  });
  // Help output path already covered by existing cli-source-coverage tests; skip here to avoid duplication
});
