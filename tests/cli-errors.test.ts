import * as fs from 'fs';
import * as path from 'path';
import { runCLI } from '../src/cli';

interface CLIResult {
  stdout: string;
  stderr: string;
  exitCode: number;
}

function invokeCLI(args: string[]): CLIResult {
  const logs: string[] = [];
  const errs: string[] = [];
  let exitCode = 0;

  const logSpy = jest
    .spyOn(console, 'log')
    .mockImplementation((...m: any[]) => {
      logs.push(m.map(String).join(' '));
    });
  // Capture direct writes (commander help uses process.stdout.write)
  const writeSpy = jest
    .spyOn(process.stdout, 'write')
    // @ts-ignore - override to collect help output
    .mockImplementation((chunk: any) => {
      logs.push(String(chunk));
      return true;
    });
  const errSpy = jest
    .spyOn(console, 'error')
    .mockImplementation((...m: any[]) => {
      errs.push(m.map(String).join(' '));
    });
  const exitSpy = jest
    .spyOn(process, 'exit')
    // @ts-ignore - override to capture exit code without terminating or throwing
    .mockImplementation((code?: number) => {
      exitCode = typeof code === 'number' ? code : 0;
      return undefined as never; // mimic process exit without exception
    });

  runCLI(args);
  try {
    // no-op
  } finally {
    logSpy.mockRestore();
    writeSpy.mockRestore();
    errSpy.mockRestore();
    exitSpy.mockRestore();
  }

  return { stdout: logs.join('\n'), stderr: errs.join('\n'), exitCode };
}

describe('CLI Error Handling and Edge Cases', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  // Test for uncovered switch cases in validate-record
  describe('record command with unsupported types', () => {
    it('should error in strict mode for unsupported record type', async () => {
      const record = {
        type: 'UNSUPPORTED',
        name: 'test.com',
        value: '1.2.3.4',
      };
      const { exitCode, stdout } = invokeCLI([
        'record',
        '--strict',
        '--data',
        JSON.stringify(record),
      ]);
      expect(exitCode).toBe(1);
      expect(stdout).toContain('Invalid UNSUPPORTED record structure');
    });
  });

  // Test for JSON parsing errors
  describe('CLI with invalid JSON input', () => {
    it('should exit with an error for malformed JSON in record command', async () => {
      const { exitCode, stderr } = invokeCLI([
        'record',
        '--data',
        '{ "type": "A", "name": "test.com", "value": }',
      ]);
      expect(exitCode).toBe(1);
      expect(stderr).toContain('Error:');
      expect(stderr).toContain('Unexpected token');
    });

    it('should exit with an error for malformed JSON in query command', async () => {
      const { exitCode, stderr } = invokeCLI([
        'query',
        '--data',
        '{ "questions": [], "answers": [ }',
      ]);
      expect(exitCode).toBe(1);
      expect(stderr).toContain('Error:');
      expect(stderr).toContain('Unexpected token');
    });
  });

  // Test for file not found error
  describe('CLI with non-existent file', () => {
    it('should exit with an error if the file does not exist', async () => {
      const { exitCode, stderr } = invokeCLI([
        'record',
        '--file',
        'non-existent-file.json',
      ]);
      expect(exitCode).toBe(1);
      expect(stderr).toContain('Error:');
      expect(stderr).toMatch(/ENOENT/);
    });
  });

  // Test for process.exit(1) on bulk validation failure
  describe('bulk command with failures', () => {
    it('should exit with code 1 if there are structural validation failures in strict mode', async () => {
      const records = [
        { type: 'A', name: 'valid.com', address: '1.1.1.1' },
        // Missing address field -> isDNSRecord false, with --strict should produce thrown error => success false
        { type: 'A', name: 'invalid.com' },
      ];
      const filePath = path.resolve('./test-bulk-records.json');
      fs.writeFileSync(filePath, JSON.stringify(records));
      // Capture error console separately
      const { exitCode, stderr } = invokeCLI([
        'bulk',
        '--file',
        filePath,
        '--format',
        'json',
        '--strict',
      ]);
      expect(exitCode).toBe(1);
      expect(stderr).toContain('Summary: 1 succeeded, 1 failed');
      fs.unlinkSync(filePath);
    });
  });

  // Additional coverage: table and csv formats
  describe('output formats', () => {
    it('should render table format', () => {
      const rec = { type: 'A', name: 'ex.com', address: '1.2.3.4' };
      const { stdout, exitCode } = invokeCLI([
        'record',
        '--data',
        JSON.stringify(rec),
        '--format',
        'table',
      ]);
      expect(exitCode).toBe(0);
      expect(stdout).toMatch(/\| Type \|/);
    });
    it('should render csv format', () => {
      const rec = { type: 'A', name: 'ex.com', address: '1.2.3.4' };
      const { stdout, exitCode } = invokeCLI([
        'record',
        '--data',
        JSON.stringify(rec),
        '--format',
        'csv',
      ]);
      expect(exitCode).toBe(0);
      // Header cells are quoted in implementation
      expect(stdout.split('\n')[0]).toBe(
        '"Type","Success","Error","RecordData"'
      );
    });
  });

  // Additional coverage: examples command
  describe('examples command', () => {
    it('should print examples text', () => {
      const { stdout } = invokeCLI(['examples']);
      expect(stdout).toContain('Usage Examples');
      expect(stdout).toContain('Validate a single A record');
    });
  });

  // Additional coverage: no args help output
  describe('no arguments help', () => {
    it('should show help text', () => {
      const { stdout } = invokeCLI([]);
      // Commander help text contains usage line and command descriptions
      expect(stdout).toMatch(/dns-response-validator/);
      expect(stdout).toMatch(/Validate a single DNS record/);
    });
  });

  // Additional coverage: file output path
  describe('file output', () => {
    it('should write output to file', () => {
      const rec = { type: 'A', name: 'ex.com', address: '1.2.3.4' };
      const outPath = path.resolve('./cli-output.json');
      const { exitCode, stderr } = invokeCLI([
        'record',
        '--data',
        JSON.stringify(rec),
        '--output',
        outPath,
      ]);
      expect(exitCode).toBe(0);
      expect(stderr).toBe('');
      const written = fs.readFileSync(outPath, 'utf8');
      expect(written).toContain('ex.com');
      fs.unlinkSync(outPath);
    });
  });
});
