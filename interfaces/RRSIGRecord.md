# Interface: RRSIGRecord

Defined in: [types.ts:603](https://github.com/Nick2bad4u/dnsValidator/blob/main/src/types.ts#L603)

RRSIG record - Resource Record Signature, contains DNSSEC signature for a resource record set.

## Example

```typescript
const record: RRSIGRecord = {
  type: 'RRSIG',
  typeCovered: 'A',
  algorithm: 8, // RSA/SHA-256
  labels: 2,
  originalTTL: 300,
  signatureExpiration: 1640995200,
  signatureInception: 1640908800,
  keyTag: 12345,
  signerName: 'example.com',
  signature: 'ABCDEF123456...',
  ttl: 300
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

> **type**: `"RRSIG"`

Defined in: [types.ts:604](https://github.com/Nick2bad4u/dnsValidator/blob/main/src/types.ts#L604)

The type of DNS record

#### Overrides

[`BaseDNSRecord`](BaseDNSRecord.md).[`type`](BaseDNSRecord.md#type)

***

### typeCovered

> **typeCovered**: `string`

Defined in: [types.ts:606](https://github.com/Nick2bad4u/dnsValidator/blob/main/src/types.ts#L606)

Type of RRset covered by this signature

***

### algorithm

> **algorithm**: `number`

Defined in: [types.ts:608](https://github.com/Nick2bad4u/dnsValidator/blob/main/src/types.ts#L608)

Cryptographic algorithm used

***

### labels

> **labels**: `number`

Defined in: [types.ts:610](https://github.com/Nick2bad4u/dnsValidator/blob/main/src/types.ts#L610)

Number of labels in the original RRSIG RR owner name

***

### originalTTL

> **originalTTL**: `number`

Defined in: [types.ts:612](https://github.com/Nick2bad4u/dnsValidator/blob/main/src/types.ts#L612)

Original TTL of the covered RRset

***

### signatureExpiration

> **signatureExpiration**: `number`

Defined in: [types.ts:614](https://github.com/Nick2bad4u/dnsValidator/blob/main/src/types.ts#L614)

Signature expiration time (Unix timestamp)

***

### signatureInception

> **signatureInception**: `number`

Defined in: [types.ts:616](https://github.com/Nick2bad4u/dnsValidator/blob/main/src/types.ts#L616)

Signature inception time (Unix timestamp)

***

### keyTag

> **keyTag**: `number`

Defined in: [types.ts:618](https://github.com/Nick2bad4u/dnsValidator/blob/main/src/types.ts#L618)

Key tag of the DNSKEY RR that validates this signature

***

### signerName

> **signerName**: `string`

Defined in: [types.ts:620](https://github.com/Nick2bad4u/dnsValidator/blob/main/src/types.ts#L620)

Domain name of the signer

***

### signature

> **signature**: `string`

Defined in: [types.ts:622](https://github.com/Nick2bad4u/dnsValidator/blob/main/src/types.ts#L622)

Base64-encoded signature
