# Interface: RRSIGRecord

Defined in: [types.ts:518](https://github.com/Nick2bad4u/dnsValidator/blob/main/src/types.ts#L518)

RRSIG record - Resource Record Signature, contains DNSSEC signature for a
resource record set.

## Example

```typescript
const record: RRSIGRecord = {
    type: "RRSIG",
    typeCovered: "A",
    algorithm: 8, // RSA/SHA-256
    labels: 2,
    originalTTL: 300,
    signatureExpiration: 1640995200,
    signatureInception: 1640908800,
    keyTag: 12345,
    signerName: "example.com",
    signature: "ABCDEF123456...",
    ttl: 300,
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

Defined in: [types.ts:520](https://github.com/Nick2bad4u/dnsValidator/blob/main/src/types.ts#L520)

Cryptographic algorithm used

***

### keyTag

> **keyTag**: `number`

Defined in: [types.ts:522](https://github.com/Nick2bad4u/dnsValidator/blob/main/src/types.ts#L522)

Key tag of the DNSKEY RR that validates this signature

***

### labels

> **labels**: `number`

Defined in: [types.ts:524](https://github.com/Nick2bad4u/dnsValidator/blob/main/src/types.ts#L524)

Number of labels in the original RRSIG RR owner name

***

### originalTTL

> **originalTTL**: `number`

Defined in: [types.ts:526](https://github.com/Nick2bad4u/dnsValidator/blob/main/src/types.ts#L526)

Original TTL of the covered RRset

***

### signature

> **signature**: `string`

Defined in: [types.ts:528](https://github.com/Nick2bad4u/dnsValidator/blob/main/src/types.ts#L528)

Base64-encoded signature

***

### signatureExpiration

> **signatureExpiration**: `number`

Defined in: [types.ts:530](https://github.com/Nick2bad4u/dnsValidator/blob/main/src/types.ts#L530)

Signature expiration time (Unix timestamp)

***

### signatureInception

> **signatureInception**: `number`

Defined in: [types.ts:532](https://github.com/Nick2bad4u/dnsValidator/blob/main/src/types.ts#L532)

Signature inception time (Unix timestamp)

***

### signerName

> **signerName**: `string`

Defined in: [types.ts:534](https://github.com/Nick2bad4u/dnsValidator/blob/main/src/types.ts#L534)

Domain name of the signer

***

### type

> **type**: `"RRSIG"`

Defined in: [types.ts:535](https://github.com/Nick2bad4u/dnsValidator/blob/main/src/types.ts#L535)

The type of DNS record

#### Overrides

[`BaseDNSRecord`](BaseDNSRecord.md).[`type`](BaseDNSRecord.md#type)

***

### typeCovered

> **typeCovered**: `string`

Defined in: [types.ts:537](https://github.com/Nick2bad4u/dnsValidator/blob/main/src/types.ts#L537)

Type of RRset covered by this signature
