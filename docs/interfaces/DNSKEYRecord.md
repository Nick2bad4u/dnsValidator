# Interface: DNSKEYRecord

Defined in: [types.ts:449](https://github.com/Nick2bad4u/dnsValidator/blob/main/src/types.ts#L449)

DNSKEY record - Contains a public key used for DNSSEC validation.

## Example

```typescript
const record: DNSKEYRecord = {
  type: 'DNSKEY',
  flags: 257, // Key Signing Key
  protocol: 3,
  algorithm: 8, // RSA/SHA-256
  publicKey: 'AwEAAag/59Q...',
  ttl: 86400
};
```

## Extends

- [`BaseDNSRecord`](BaseDNSRecord.md)

## Properties

### ttl?

> `optional` **ttl**: `number`

Defined in: [types.ts:42](https://github.com/Nick2bad4u/dnsValidator/blob/main/src/types.ts#L42)

Time to live in seconds (optional)

#### Inherited from

[`BaseDNSRecord`](BaseDNSRecord.md).[`ttl`](BaseDNSRecord.md#ttl)

***

### type

> **type**: `"DNSKEY"`

Defined in: [types.ts:450](https://github.com/Nick2bad4u/dnsValidator/blob/main/src/types.ts#L450)

The type of DNS record

#### Overrides

[`BaseDNSRecord`](BaseDNSRecord.md).[`type`](BaseDNSRecord.md#type)

***

### flags

> **flags**: `number`

Defined in: [types.ts:452](https://github.com/Nick2bad4u/dnsValidator/blob/main/src/types.ts#L452)

Flags field (bit 7 = Zone Key, bit 15 = Secure Entry Point)

***

### protocol

> **protocol**: `number`

Defined in: [types.ts:454](https://github.com/Nick2bad4u/dnsValidator/blob/main/src/types.ts#L454)

Protocol field (always 3 for DNSSEC)

***

### algorithm

> **algorithm**: `number`

Defined in: [types.ts:456](https://github.com/Nick2bad4u/dnsValidator/blob/main/src/types.ts#L456)

Cryptographic algorithm number

***

### publicKey

> **publicKey**: `string`

Defined in: [types.ts:458](https://github.com/Nick2bad4u/dnsValidator/blob/main/src/types.ts#L458)

Base64-encoded public key
