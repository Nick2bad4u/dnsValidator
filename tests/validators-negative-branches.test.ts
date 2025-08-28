import { validateDNSRecord } from '../src/validators';

describe('validateDNSRecord negative suggestion branches', () => {
  it('A record suggestion', () => {
    const r = validateDNSRecord({ type: 'A', address: '999.999.999.999' });
    expect(r.isValid).toBe(false);
    expect(r.errors.some(e => e.includes('A records require'))).toBe(true);
  });
  it('AAAA record suggestion', () => {
    const r = validateDNSRecord({ type: 'AAAA', address: 'not:ipv6' });
    expect(r.isValid).toBe(false);
    expect(r.errors.some(e => e.includes('AAAA records require'))).toBe(true);
  });
  it('MX record suggestion', () => {
    const r = validateDNSRecord({
      type: 'MX',
      priority: -1,
      exchange: 'bad..domain',
    });
    expect(r.isValid).toBe(false);
    expect(r.errors.some(e => e.includes('MX records require'))).toBe(true);
  });
  it('CNAME record suggestion', () => {
    const r = validateDNSRecord({ type: 'CNAME', value: 'bad..domain' });
    expect(r.isValid).toBe(false);
    expect(r.errors.some(e => e.includes('CNAME records require'))).toBe(true);
  });
  it('TXT record suggestion', () => {
    const r = validateDNSRecord({ type: 'TXT', entries: 'not-array' });
    expect(r.isValid).toBe(false);
    expect(r.errors.some(e => e.includes('TXT records require'))).toBe(true);
  });
  it('NS record suggestion', () => {
    const r = validateDNSRecord({ type: 'NS', value: 'invalid..domain' });
    expect(r.isValid).toBe(false);
    expect(r.errors.some(e => e.includes('NS records require'))).toBe(true);
  });
  it('PTR record suggestion', () => {
    const r = validateDNSRecord({ type: 'PTR', value: 'invalid..domain' });
    expect(r.isValid).toBe(false);
    expect(r.errors.some(e => e.includes('PTR records require'))).toBe(true);
  });
  it('SOA record suggestion (alias fields)', () => {
    const r = validateDNSRecord({
      type: 'SOA',
      primary: 'ns1..bad',
      admin: 'bad-admin',
      serial: -1,
      refresh: -1,
      retry: -1,
      expiration: -1,
      minimum: -1,
    });
    expect(r.isValid).toBe(false);
    expect(r.errors.some(e => e.includes('SOA records require'))).toBe(true);
  });
  it('SRV record suggestion', () => {
    const r = validateDNSRecord({
      type: 'SRV',
      priority: -1,
      weight: -1,
      port: 99999,
      name: 'bad..domain',
    });
    expect(r.isValid).toBe(false);
    expect(r.errors.some(e => e.includes('SRV records require'))).toBe(true);
  });
  it('CAA record suggestion', () => {
    const r = validateDNSRecord({ type: 'CAA', critical: 999 });
    expect(r.isValid).toBe(false);
    expect(r.errors.some(e => e.includes('CAA records require'))).toBe(true);
  });
  it('NAPTR record suggestion', () => {
    const r = validateDNSRecord({
      type: 'NAPTR',
      order: -1,
      preference: -2,
      flags: 'Z',
      service: '',
      regexp: 5 as any,
      replacement: 7 as any,
    });
    expect(r.isValid).toBe(false);
    expect(r.errors.some(e => e.includes('NAPTR records require'))).toBe(true);
  });
  it('TLSA record suggestion (alias fields)', () => {
    const r = validateDNSRecord({
      type: 'TLSA',
      usage: 9,
      selector: -1,
      matchingType: 9,
      certificate: 'nothex!',
    });
    expect(r.isValid).toBe(false);
    expect(r.errors.some(e => e.includes('TLSA records require'))).toBe(true);
  });
  it('DNSKEY record suggestion', () => {
    const r = validateDNSRecord({
      type: 'DNSKEY',
      flags: -1,
      protocol: 2,
      algorithm: 999,
      publicKey: 'nothex!',
    });
    expect(r.isValid).toBe(false);
    expect(r.errors.some(e => e.includes('DNSKEY records require'))).toBe(true);
  });
  it('DS record suggestion', () => {
    const r = validateDNSRecord({
      type: 'DS',
      keyTag: -5,
      algorithm: 999,
      digestType: 9,
      digest: 'nothex',
    });
    expect(r.isValid).toBe(false);
    expect(r.errors.some(e => e.includes('DS records require'))).toBe(true);
  });
  it('NSEC record suggestion', () => {
    const r = validateDNSRecord({
      type: 'NSEC',
      nextDomainName: 'bad..domain',
      typeBitMaps: 'not-array',
    });
    expect(r.isValid).toBe(false);
    expect(r.errors.some(e => e.includes('NSEC records require'))).toBe(true);
  });
  it('NSEC3 record suggestion', () => {
    const r = validateDNSRecord({
      type: 'NSEC3',
      hashAlgorithm: 2,
      flags: -1,
      iterations: -1,
      salt: 'ZZ',
      nextHashedOwnerName: 123,
      typeBitMaps: 'oops',
    });
    expect(r.isValid).toBe(false);
    expect(r.errors.some(e => e.includes('NSEC3 records require'))).toBe(true);
  });
  it('RRSIG record suggestion', () => {
    const r = validateDNSRecord({
      type: 'RRSIG',
      typeCovered: 123,
      algorithm: 'x',
      labels: 'y',
      originalTTL: -1,
      signatureExpiration: -2,
      signatureInception: -3,
      keyTag: 'abc',
      signerName: 42,
      signature: 99,
    });
    expect(r.isValid).toBe(false);
    expect(r.errors.some(e => e.includes('RRSIG records require'))).toBe(true);
  });
  it('SSHFP record suggestion', () => {
    const r = validateDNSRecord({
      type: 'SSHFP',
      algorithm: 99,
      fpType: 3,
      fingerprint: 'nothex',
    });
    expect(r.isValid).toBe(false);
    expect(r.errors.some(e => e.includes('SSHFP records require'))).toBe(true);
  });
  it('Unsupported type suggestion', () => {
    const r = validateDNSRecord({ type: 'UNKNOWN', some: 'data' });
    expect(r.isValid).toBe(false);
    expect(r.errors.some(e => e.includes('Unsupported record type'))).toBe(
      true
    );
  });
});
