# Type Alias: DNSRecord

```ts
type DNSRecord =
  | AAAARecord
  | ANYRecord
  | ARecord
  | CAARecord
  | CNAMERecord
  | DNSKEYRecord
  | DSRecord
  | MXRecord
  | NAPTRRecord
  | NSEC3PARAMRecord
  | NSEC3Record
  | NSECRecord
  | NSRecord
  | PTRRecord
  | RRSIGRecord
  | SOARecord
  | SRVRecord
  | SSHFPRecord
  | TLSARecord
  | TXTRecord;
```

Defined in: [src/types.ts:211](https://github.com/Nick2bad4u/dnsValidator/blob/main/src/types.ts#L211)

Union type for all supported DNS record types.

This type can be used when you need to work with any DNS record type in a
type-safe manner.
