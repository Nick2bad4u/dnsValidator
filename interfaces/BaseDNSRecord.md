# Interface: BaseDNSRecord

Defined in: [types.ts:38](https://github.com/Nick2bad4u/dnsValidator/blob/main/src/types.ts#L38)

Base interface for all DNS records.

Provides common properties that all DNS records share.

## Extended by

- [`ARecord`](ARecord.md)
- [`AAAARecord`](AAAARecord.md)
- [`CNAMERecord`](CNAMERecord.md)
- [`MXRecord`](MXRecord.md)
- [`TXTRecord`](TXTRecord.md)
- [`NSRecord`](NSRecord.md)
- [`PTRRecord`](PTRRecord.md)
- [`SOARecord`](SOARecord.md)
- [`SRVRecord`](SRVRecord.md)
- [`CAARecord`](CAARecord.md)
- [`NAPTRRecord`](NAPTRRecord.md)
- [`TLSARecord`](TLSARecord.md)
- [`ANYRecord`](ANYRecord.md)
- [`DNSKEYRecord`](DNSKEYRecord.md)
- [`DSRecord`](DSRecord.md)
- [`NSECRecord`](NSECRecord.md)
- [`NSEC3Record`](NSEC3Record.md)
- [`NSEC3PARAMRecord`](NSEC3PARAMRecord.md)
- [`RRSIGRecord`](RRSIGRecord.md)
- [`SSHFPRecord`](SSHFPRecord.md)

## Properties

### type

> **type**: [`DNSRecordType`](../type-aliases/DNSRecordType.md)

Defined in: [types.ts:40](https://github.com/Nick2bad4u/dnsValidator/blob/main/src/types.ts#L40)

The type of DNS record

***

### ttl?

> `optional` **ttl**: `number`

Defined in: [types.ts:42](https://github.com/Nick2bad4u/dnsValidator/blob/main/src/types.ts#L42)

Time to live in seconds (optional)
