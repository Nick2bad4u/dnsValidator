# Type Alias: DNSRecord

> **DNSRecord** = [`ARecord`](../interfaces/ARecord.md) \| [`AAAARecord`](../interfaces/AAAARecord.md) \| [`CNAMERecord`](../interfaces/CNAMERecord.md) \| [`MXRecord`](../interfaces/MXRecord.md) \| [`TXTRecord`](../interfaces/TXTRecord.md) \| [`NSRecord`](../interfaces/NSRecord.md) \| [`PTRRecord`](../interfaces/PTRRecord.md) \| [`SOARecord`](../interfaces/SOARecord.md) \| [`SRVRecord`](../interfaces/SRVRecord.md) \| [`CAARecord`](../interfaces/CAARecord.md) \| [`NAPTRRecord`](../interfaces/NAPTRRecord.md) \| [`TLSARecord`](../interfaces/TLSARecord.md) \| [`ANYRecord`](../interfaces/ANYRecord.md) \| [`DNSKEYRecord`](../interfaces/DNSKEYRecord.md) \| [`DSRecord`](../interfaces/DSRecord.md) \| [`NSECRecord`](../interfaces/NSECRecord.md) \| [`NSEC3Record`](../interfaces/NSEC3Record.md) \| [`NSEC3PARAMRecord`](../interfaces/NSEC3PARAMRecord.md) \| [`RRSIGRecord`](../interfaces/RRSIGRecord.md) \| [`SSHFPRecord`](../interfaces/SSHFPRecord.md)

Defined in: [types.ts:659](https://github.com/Nick2bad4u/dnsValidator/blob/main/src/types.ts#L659)

Union type for all supported DNS record types.

This type can be used when you need to work with any DNS record type
in a type-safe manner.
