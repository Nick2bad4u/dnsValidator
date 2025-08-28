import { spawnSync } from 'child_process';
import { writeFileSync, unlinkSync, readFileSync } from 'fs';
import { join } from 'path';

const cli = join(__dirname, '..', 'dist', 'cli.js');

// Helper spawn
function run(args: string[], input?: string) {
  return spawnSync('node', [cli, ...args], { input, encoding: 'utf8' });
}

describe('CLI integration', () => {
  test('shows help when no args', () => {
    const res = spawnSync('node', [cli], { encoding: 'utf8' });
    expect(res.stdout + res.stderr).toMatch(/Usage Examples|CLI tool for validating DNS/);
    // Accept 0 or 0-like exit; commander may exit 0; if non-zero treat as acceptable if help shown.
    expect(res.status === 0 || res.status === 1).toBe(true);
  });

  test('record valid JSON via --data json output', () => {
    const data = '{"type":"A","address":"1.2.3.4"}';
    const res = run(['record', '--type', 'A', '--data', data, '--format', 'json']);
    expect(res.stdout).toMatch(/"success"\s*:\s*true/);
    expect(res.status).toBe(0);
  });

  test('record invalid strict exits non-zero', () => {
    const data = '{"type":"A","address":"999.999.999.999"}';
    const res = run(['record', '--data', data, '--type', 'A', '--strict']);
    expect(res.status).not.toBe(0);
    expect(res.stdout + res.stderr).toMatch(/Invalid A record/);
  });

  test('query valid', () => {
    const query = JSON.stringify({ question: { name: 'example.com', type: 'A', class: 'IN' }, answers: [{ type: 'A', address: '1.2.3.4' }] });
    const res = run(['query', '--data', query]);
    expect(res.status).toBe(0);
    expect(res.stdout).toMatch(/"success"\s*:\s*true/);
  });

  test('bulk records table & summary failure exit (strict)', () => {
    const file = join(__dirname, 'bulk.json');
    writeFileSync(file, JSON.stringify([
      { type: 'A', address: '1.2.3.4' },
      { type: 'A', address: '999.999.999.999' }
    ]));
    const res = run(['bulk', '--file', file, '--format', 'table', '--strict', '--verbose']);
    expect(res.stdout).toMatch(/Type\s*\|\s*Status/);
    expect(res.stderr).toMatch(/Summary: 1 succeeded, 1 failed/);
    expect(res.status).not.toBe(0);
    unlinkSync(file);
  });

  test('bulk queries csv success', () => {
    const file = join(__dirname, 'bulkq.json');
    writeFileSync(file, JSON.stringify([
      { question: { name: 'example.com', type: 'A', class: 'IN' }, answers: [{ type: 'A', address: '1.2.3.4' }] }
    ]));
    const res = run(['bulk', '--file', file, '--mode', 'queries', '--format', 'csv']);
    expect(res.stdout).toMatch(/Type","Success","Error","RecordData/);
    expect(res.status).toBe(0);
    unlinkSync(file);
  });

  test('examples command prints examples', () => {
    const res = run(['examples']);
    expect(res.stdout).toMatch(/Usage Examples/);
  });

  test('record csv output file', () => {
    const out = join(__dirname, 'out.csv');
    const res = run(['record', '--type', 'A', '--data', '{"address":"1.1.1.1"}', '--format', 'csv', '--output', out]);
    expect(res.stdout).toMatch(/Results written to/);
    const content = readFileSync(out, 'utf8');
    expect(content).toMatch(/Type","Success","Error","RecordData/);
    unlinkSync(out);
  });
});
