import { spawnSync } from 'child_process';
import { join } from 'path';
import { pathToFileURL } from 'url';
import { writeFileSync, mkdtempSync } from 'fs';
import { tmpdir } from 'os';

describe('ESM build entry', () => {
  const nodeCmd = process.execPath;

  function runESM(code: string) {
    const dir = mkdtempSync(join(tmpdir(), 'dnsval-esm-'));
    const file = join(dir, 'test.mjs');
    writeFileSync(file, code, 'utf8');
    return spawnSync(nodeCmd, [file], { encoding: 'utf8' });
  }

  test('import root export', () => {
    const esmPath = pathToFileURL(join(__dirname, '../dist/esm/index.js')).href;
    const code = `import * as m from '${esmPath}';\nconsole.log(typeof m.validateDNSRecord);`;
    const { stdout, stderr, status } = runESM(code);
    expect({ status, stderr: stderr.trim(), out: stdout.trim() }).toEqual({
      status: 0,
      stderr: '',
      out: 'function',
    });
  });

  test('import validators subpath', () => {
    const esmPath = pathToFileURL(
      join(__dirname, '../dist/esm/validators.js')
    ).href;
    const code = `import * as m from '${esmPath}';\nconsole.log(typeof m.isARecord);`;
    const { stdout, stderr, status } = runESM(code);
    expect({ status, stderr: stderr.trim(), out: stdout.trim() }).toEqual({
      status: 0,
      stderr: '',
      out: 'function',
    });
  });
});
