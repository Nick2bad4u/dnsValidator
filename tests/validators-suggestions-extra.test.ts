import { validateDNSRecord } from '../src/validators';

describe('validators suggestions extra coverage', () => {
  // Array of [record, expectedRegex]
  const cases: Array<[any, RegExp]> = [
    [{ type: 'A', address: '999.999.999.999' }, /A records require/],
    [{ type: 'AAAA', address: 'invalid::ip' }, /AAAA records require/],
    [
      { type: 'MX', exchange: 'not_a_domain', priority: -1 },
      /MX records require/,
    ],
    [{ type: 'CNAME', value: 'not_a_domain' }, /CNAME records require/],
    [{ type: 'TXT', entries: 'not-array' }, /TXT records require/],
    [{ type: 'NS', value: 'not_a_domain' }, /NS records require/],
    [{ type: 'PTR', value: 'not_a_domain' }, /PTR records require/],
    [{ type: 'SOA', primary: 'example.com' }, /SOA records require/],
    [{ type: 'SRV', name: 'example.com', priority: -1 }, /SRV records require/],
    [{ type: 'CAA', critical: 999 }, /CAA records require/],
    [{ type: 'NAPTR', order: -1 }, /NAPTR records require/],
    [{ type: 'TLSA', usage: 9 }, /TLSA records require/],
    [{ type: 'DNSKEY', flags: -1 }, /DNSKEY records require/],
    [{ type: 'DS', keyTag: -1 }, /DS records require/],
    [{ type: 'NSEC', nextDomainName: 'bad..domain' }, /NSEC records require/],
    [{ type: 'NSEC3', hashAlgorithm: 2 }, /NSEC3 records require/],
    [{ type: 'RRSIG', typeCovered: 'A' }, /RRSIG records require/],
    [{ type: 'SSHFP', algorithm: 9 }, /SSHFP records require/],
    [{ type: 'UNKNOWN2', foo: 'bar' }, /Unsupported record type/],
  ];

  test.each(cases)('invalid %p record suggestions', (rec, expectMsg) => {
    const res = validateDNSRecord(rec);
    expect(res.isValid).toBe(false);
    expect(res.errors.some(e => expectMsg.test(e))).toBe(true);
  });
});
