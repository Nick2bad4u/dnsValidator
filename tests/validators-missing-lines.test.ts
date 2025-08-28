import {
  isSOARecord,
  isCAARecord,
  isTLSARecord,
  isANYRecord,
  isTXTRecord,
} from '../src/validators';

describe('Additional validator coverage for missed lines', () => {
  it('validates SOA record using alternate field names (nsname, hostmaster, expire, minttl)', () => {
    const soaAlt = {
      type: 'SOA',
      nsname: 'ns1.example.com',
      hostmaster: 'hostmaster.example.com',
      serial: 1,
      refresh: 1,
      retry: 1,
      expire: 1,
      minttl: 1,
    };
    expect(isSOARecord(soaAlt)).toBe(true);
  });

  it('validates CAA record with contactphone only property', () => {
    const caa = { type: 'CAA', critical: 0, contactphone: '+123456789' };
    expect(isCAARecord(caa)).toBe(true);
  });

  it('validates TLSA record using alternative field names (certUsage, match) with Uint8Array data', () => {
    const tlsa = {
      type: 'TLSA',
      certUsage: 0,
      selector: 0,
      match: 1,
      data: new Uint8Array([0xab, 0xcd, 0xef]),
    };
    expect(isTLSARecord(tlsa)).toBe(true);
  });

  it('valid ANY record with records array path', () => {
    const any = {
      type: 'ANY',
      records: [
        { type: 'A', address: '1.1.1.1' },
        { type: 'AAAA', address: '2001:db8::1' },
      ],
    };
    expect(isANYRecord(any)).toBe(true);
  });

  it('TXT record invalid due to non-string entry to exercise entries.every branch', () => {
    const badTxt = { type: 'TXT', entries: ['ok', 123] } as any;
    expect(isTXTRecord(badTxt)).toBe(false);
  });
});
