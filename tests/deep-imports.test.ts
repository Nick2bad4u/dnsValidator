describe('deep import subpaths', () => {
  test('validators deep import', () => {
    const { validateDNSRecord } = require('dns-response-validator/validators');
    expect(typeof validateDNSRecord).toBe('function');
  });

  test('dnssec deep import', () => {
    const { validateRRSIG } = require('dns-response-validator/dnssec');
    expect(typeof validateRRSIG).toBe('function');
  });

  test('types deep import (types only)', () => {
    // Importing types subpath at runtime resolves to d.ts; ensure no throw when requiring
    expect(() => require('dns-response-validator/types')).not.toThrow();
  });
});
