import {
  validateAAAARecord,
  validateMXRecord,
  validateARecord,
} from '../src/enhanced-validators';

describe('enhanced validators extra branches', () => {
  test('validateAAAARecord wrong type early return', () => {
    const res = validateAAAARecord({ type: 'A', address: '1.2.3.4' } as any);
    expect(res.isValid).toBe(false);
    expect(res.errors[0]).toMatch(/Expected record type 'AAAA'/);
  });

  test('validateAAAARecord invalid ipv6 branch', () => {
    const res = validateAAAARecord({ type: 'AAAA', address: 'invalid::ip' });
    expect(res.isValid).toBe(false);
    expect(res.errors.some(e => /Invalid IPv6 address/.test(e))).toBe(true);
  });

  test('validateAAAARecord invalid ttl branch', () => {
    const res = validateAAAARecord({
      type: 'AAAA',
      address: '2001:db8::1',
      ttl: -5,
    });
    expect(res.isValid).toBe(false);
    expect(res.errors.some(e => /Invalid TTL/.test(e))).toBe(true);
  });

  test('validateMXRecord wrong type early return', () => {
    const res = validateMXRecord({
      type: 'A',
      exchange: 'mail.example.com',
      priority: 10,
    } as any);
    expect(res.isValid).toBe(false);
    expect(res.errors[0]).toMatch(/Expected record type 'MX'/);
  });

  test('validateMXRecord invalid exchange fqdn branch', () => {
    const res = validateMXRecord({
      type: 'MX',
      exchange: 'not_a_domain',
      priority: 10,
    });
    expect(res.isValid).toBe(false);
    expect(res.errors.some(e => /Invalid FQDN for exchange/.test(e))).toBe(
      true
    );
  });

  test('validateMXRecord invalid priority branch', () => {
    const res = validateMXRecord({
      type: 'MX',
      exchange: 'mail.example.com',
      priority: 999999,
    });
    expect(res.isValid).toBe(false);
    expect(res.errors.some(e => /Invalid priority/.test(e))).toBe(true);
  });

  test('validateMXRecord invalid ttl branch', () => {
    const res = validateMXRecord({
      type: 'MX',
      exchange: 'mail.example.com',
      priority: 10,
      ttl: -10,
    });
    expect(res.isValid).toBe(false);
    expect(res.errors.some(e => /Invalid TTL value: -10/.test(e))).toBe(true);
  });

  // Added tests to cover missing address branches for A and AAAA records where address is not a string
  test('validateARecord missing address field type error', () => {
    const res = validateARecord({ type: 'A', address: 123 } as any);
    expect(res.isValid).toBe(false);
    expect(
      res.errors.some(e =>
        /A record must have a 'address' field of type string/.test(e)
      )
    ).toBe(true);
  });

  test('validateAAAARecord missing address field type error', () => {
    const res = validateAAAARecord({ type: 'AAAA', address: 123 } as any);
    expect(res.isValid).toBe(false);
    expect(
      res.errors.some(e =>
        /AAAA record must have a 'address' field of type string/.test(e)
      )
    ).toBe(true);
  });
});
