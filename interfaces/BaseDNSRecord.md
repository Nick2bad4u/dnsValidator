# Interface: BaseDNSRecord

Defined in: [types.ts:74](https://github.com/Nick2bad4u/dnsValidator/blob/main/src/types.ts#L74)

Base interface for all DNS records.

Provides common properties that all DNS records share.

## Extended by

- [`AAAARecord`](AAAARecord.md)
- [`ANYRecord`](ANYRecord.md)
- [`ARecord`](ARecord.md)
- [`CAARecord`](CAARecord.md)
- [`CNAMERecord`](CNAMERecord.md)
- [`DNSKEYRecord`](DNSKEYRecord.md)
- [`DSRecord`](DSRecord.md)
- [`MXRecord`](MXRecord.md)
- [`NAPTRRecord`](NAPTRRecord.md)
- [`NSEC3PARAMRecord`](NSEC3PARAMRecord.md)
- [`NSEC3Record`](NSEC3Record.md)
- [`NSECRecord`](NSECRecord.md)
- [`NSRecord`](NSRecord.md)
- [`PTRRecord`](PTRRecord.md)
- [`RRSIGRecord`](RRSIGRecord.md)
- [`SOARecord`](SOARecord.md)
- [`SRVRecord`](SRVRecord.md)
- [`SSHFPRecord`](SSHFPRecord.md)
- [`TLSARecord`](TLSARecord.md)
- [`TXTRecord`](TXTRecord.md)

## Properties

### ttl?

> `optional` **ttl?**: `number`

Defined in: [types.ts:76](https://github.com/Nick2bad4u/dnsValidator/blob/main/src/types.ts#L76)

Time to live in seconds (optional)

***

### type

> **type**: [`DNSRecordType`](../type-aliases/DNSRecordType.md)

Defined in: [types.ts:78](https://github.com/Nick2bad4u/dnsValidator/blob/main/src/types.ts#L78)

The type of DNS record
