# Interface: DNSKEYRecord

Defined in: [types.ts:155](https://github.com/Nick2bad4u/dnsValidator/blob/main/src/types.ts#L155)

DNSKEY record - Contains a public key used for DNSSEC validation.

## Example

```typescript
const record: DNSKEYRecord = {
    type: "DNSKEY",
    flags: 257, // Key Signing Key
    protocol: 3,
    algorithm: 8, // RSA/SHA-256
    publicKey: "AwEAAag/59Q...",
    ttl: 86400,
};
```

## Extends

- [`BaseDNSRecord`](BaseDNSRecord.md)

## Properties

### ttl?

> `optional` **ttl?**: `number`

Defined in: [types.ts:76](https://github.com/Nick2bad4u/dnsValidator/blob/main/src/types.ts#L76)

Time to live in seconds (optional)

#### Inherited from

[`BaseDNSRecord`](BaseDNSRecord.md).[`ttl`](BaseDNSRecord.md#ttl)

***

### algorithm

> **algorithm**: `number`

Defined in: [types.ts:157](https://github.com/Nick2bad4u/dnsValidator/blob/main/src/types.ts#L157)

Cryptographic algorithm number

***

### flags

> **flags**: `number`

Defined in: [types.ts:159](https://github.com/Nick2bad4u/dnsValidator/blob/main/src/types.ts#L159)

Flags field (bit 7 = Zone Key, bit 15 = Secure Entry Point)

***

### protocol

> **protocol**: `number`

Defined in: [types.ts:161](https://github.com/Nick2bad4u/dnsValidator/blob/main/src/types.ts#L161)

Protocol field (always 3 for DNSSEC)

***

### publicKey

> **publicKey**: `string`

Defined in: [types.ts:163](https://github.com/Nick2bad4u/dnsValidator/blob/main/src/types.ts#L163)

Base64-encoded public key

***

### type

> **type**: `"DNSKEY"`

Defined in: [types.ts:164](https://github.com/Nick2bad4u/dnsValidator/blob/main/src/types.ts#L164)

The type of DNS record

#### Overrides

[`BaseDNSRecord`](BaseDNSRecord.md).[`type`](BaseDNSRecord.md#type)
