# Interface: DSRecord

Defined in: [types.ts:478](https://github.com/Nick2bad4u/dnsValidator/blob/main/src/types.ts#L478)

DS record - Delegation Signer, used to secure delegations between DNS zones.

## Example

```typescript
const record: DSRecord = {
  type: 'DS',
  keyTag: 12345,
  algorithm: 8, // RSA/SHA-256
  digestType: 2, // SHA-256
  digest: 'A1B2C3D4E5F6...',
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

> **type**: `"DS"`

Defined in: [types.ts:479](https://github.com/Nick2bad4u/dnsValidator/blob/main/src/types.ts#L479)

The type of DNS record

#### Overrides

[`BaseDNSRecord`](BaseDNSRecord.md).[`type`](BaseDNSRecord.md#type)

***

### keyTag

> **keyTag**: `number`

Defined in: [types.ts:481](https://github.com/Nick2bad4u/dnsValidator/blob/main/src/types.ts#L481)

Key tag of the referenced DNSKEY record

***

### algorithm

> **algorithm**: `number`

Defined in: [types.ts:483](https://github.com/Nick2bad4u/dnsValidator/blob/main/src/types.ts#L483)

Cryptographic algorithm of the referenced key

***

### digestType

> **digestType**: `number`

Defined in: [types.ts:485](https://github.com/Nick2bad4u/dnsValidator/blob/main/src/types.ts#L485)

Digest algorithm used to create the digest

***

### digest

> **digest**: `string`

Defined in: [types.ts:487](https://github.com/Nick2bad4u/dnsValidator/blob/main/src/types.ts#L487)

Hexadecimal digest of the DNSKEY record
