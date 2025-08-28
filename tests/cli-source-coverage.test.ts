import { runCLI } from '../src/cli';
import { join } from 'path';
import { writeFileSync, unlinkSync, readFileSync } from 'fs';

describe('cli.ts source coverage via runCLI', () => {
  function capture(argv: string[]) {
    const originalLog = console.log;
    const originalErr = console.error;
    const originalExit = process.exit;
    const logs: string[] = []; const errs: string[] = []; let code: number | undefined;
    (console as any).log = (...a: any[]) => logs.push(a.join(' '));
    (console as any).error = (...a: any[]) => errs.push(a.join(' '));
    (process as any).exit = (c?: number) => { code = c; throw new Error('EXIT'); };
    try { runCLI(argv); } catch (e: any) { if (e.message !== 'EXIT') throw e; } finally { console.log = originalLog; console.error = originalErr; process.exit = originalExit; }
    return { logs, errs, code };
  }

  test('record valid', () => {
    const res = capture(['record', '--type', 'A', '--data', '{"address":"1.2.3.4"}']);
    expect(res.code).toBeUndefined();
  });

  test('record invalid strict', () => {
    const res = capture(['record', '--type', 'A', '--data', '{"address":"999.999.999.999"}', '--strict']);
    expect(res.code).toBe(1);
  });

  test('query valid', () => {
    const q = '{"question":{"name":"example.com","type":"A","class":"IN"},"answers":[{"type":"A","address":"1.2.3.4"}] }';
    const res = capture(['query', '--data', q]);
    expect(res.code).toBeUndefined();
  });

  test('bulk records strict failure', () => {
    const file = join(__dirname, 'bulk-src.json');
    writeFileSync(file, JSON.stringify([{ type: 'A', address: '1.2.3.4' }, { type: 'A', address: '999.999.999.999' }]));
    const res = capture(['bulk', '--file', file, '--format', 'table', '--strict']);
    expect(res.code).toBe(1);
    unlinkSync(file);
  });

  test('bulk queries csv success', () => {
    const file = join(__dirname, 'bulkq-src.json');
    writeFileSync(file, JSON.stringify([{ question: { name: 'example.com', type: 'A', class: 'IN' }, answers: [{ type: 'A', address: '1.2.3.4' }] }]));
    const res = capture(['bulk', '--file', file, '--mode', 'queries', '--format', 'csv']);
    expect(res.code).toBeUndefined();
    unlinkSync(file);
  });

  test('record csv output file', () => {
    const outFile = join(__dirname, 'out-src.csv');
    const res = capture(['record', '--type', 'A', '--data', '{"address":"1.1.1.1"}', '--format', 'csv', '--output', outFile]);
    expect(res.code).toBeUndefined();
    const c = readFileSync(outFile, 'utf8');
    expect(c).toMatch(/Type","Success","Error","RecordData/);
    unlinkSync(outFile);
  });

  test('examples command', () => {
    const res = capture(['examples']);
    expect(res.code).toBeUndefined();
  });
});
