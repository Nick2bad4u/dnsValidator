import { runCLI } from '../src/cli';
import * as fs from 'fs';
import { globalPerformanceTracker } from '../src/performance';

// Reusable capture helper mirroring existing pattern
function capture(argv: string[]) {
  const originalLog = console.log;
  const originalErr = console.error;
  const originalExit = process.exit;
  const logs: string[] = [];
  const errs: string[] = [];
  let code: number | undefined;
  (console as any).log = (...a: any[]) => logs.push(a.join(' '));
  (console as any).error = (...a: any[]) => errs.push(a.join(' '));
  (process as any).exit = (c?: number) => {
    code = c === undefined ? 0 : c;
  }; // capture
  try {
    runCLI(argv);
  } finally {
    console.log = originalLog;
    console.error = originalErr;
    process.exit = originalExit;
  }
  return { logs, errs, code };
}

describe('CLI additional uncovered paths', () => {
  test('record command missing input error', () => {
    const res = capture(['record']);
    expect(res.code).toBe(1);
    expect(res.errs.join('\n')).toMatch(/Must provide either --data or --file/);
  });

  test('query command output file success path', () => {
    const out = 'tmp-query-out.json';
    const query = JSON.stringify({
      question: { name: 'example.com', type: 'A', class: 'IN' },
      answers: [{ type: 'A', address: '1.2.3.4' }],
    });
    const res = capture(['query', '--data', query, '--output', out]);
    expect(res.code).toBeUndefined();
    const content = fs.readFileSync(out, 'utf8');
    expect(content).toMatch(/"success"\s*:\s*true/);
    fs.unlinkSync(out);
  });

  test('bulk records all success (failCount = 0 path)', () => {
    const file = 'tmp-bulk-success.json';
    fs.writeFileSync(
      file,
      JSON.stringify([
        { type: 'A', address: '1.2.3.4' },
        { type: 'A', address: '8.8.8.8' },
      ])
    );
    const res = capture(['bulk', '--file', file]);
    fs.unlinkSync(file);
    // Expect summary with 0 failed and no exit code set
    expect(res.errs.join('\n')).toMatch(/Summary: 2 succeeded, 0 failed/);
    expect(res.code).toBeUndefined();
  });
});

describe('Performance tracker cache hit/miss direct usage', () => {
  test('record cache hit/miss increments', () => {
    globalPerformanceTracker.reset();
    globalPerformanceTracker.recordCacheHit();
    globalPerformanceTracker.recordCacheMiss();
    const metrics = globalPerformanceTracker.getMetrics();
    expect(metrics.cacheHits).toBe(1);
    expect(metrics.cacheMisses).toBe(1);
  });
});
