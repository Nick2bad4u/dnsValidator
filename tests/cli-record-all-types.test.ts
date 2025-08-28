import { runCLI } from '../src/cli';

function invoke(args: string[]) {
  const logs: string[] = [];
  const errs: string[] = [];
  let exitCode = 0;
  const logSpy = jest
    .spyOn(console, 'log')
    .mockImplementation((...m: any[]) => {
      logs.push(m.map(String).join(' '));
    });
  const errSpy = jest
    .spyOn(console, 'error')
    .mockImplementation((...m: any[]) => {
      errs.push(m.map(String).join(' '));
    });
  const exitSpy = jest.spyOn(process, 'exit').mockImplementation(((
    code?: number
  ) => {
    exitCode = code ?? 0;
    return undefined as never;
  }) as any);
  runCLI(args);
  logSpy.mockRestore();
  errSpy.mockRestore();
  exitSpy.mockRestore();
  return { stdout: logs.join('\n'), stderr: errs.join('\n'), exitCode };
}

describe('CLI record command all supported types', () => {
  const records: any[] = [
    { type: 'A', address: '1.1.1.1' },
    { type: 'AAAA', address: '2001:db8::1' },
    { type: 'MX', exchange: 'mail.example.com', priority: 10 },
    { type: 'TXT', entries: ['hello'] },
    { type: 'NS', value: 'ns1.example.com' },
    { type: 'CNAME', value: 'target.example.com' },
    { type: 'PTR', value: 'ptr.example.com' },
    {
      type: 'SRV',
      name: 'service.example.com',
      priority: 10,
      weight: 5,
      port: 5060,
    },
    { type: 'CAA', critical: 0, issue: 'letsencrypt.org' },
    {
      type: 'NAPTR',
      order: 1,
      preference: 1,
      flags: 'U',
      service: 'E2U+sip',
      regexp: '!.*!',
      replacement: '',
    },
    {
      type: 'TLSA',
      usage: 0,
      selector: 0,
      matchingType: 1,
      certificate: 'abcdef',
    },
    {
      type: 'SOA',
      primary: 'ns1.example.com',
      admin: 'hostmaster.example.com',
      serial: 1,
      refresh: 1,
      retry: 1,
      expiration: 1,
      minimum: 1,
    },
    { type: 'ZZZ', foo: 1 }, // unknown non-strict
  ];

  for (const rec of records) {
    it(`validates ${rec.type} via CLI`, () => {
      const { exitCode, stdout } = invoke([
        'record',
        '--data',
        JSON.stringify(rec),
      ]);
      expect(exitCode).toBe(0); // unknown type produces success true with warning
      expect(stdout).toContain(rec.type);
    });
  }
});
