# Interface: DSRecord

Defined in: [types.ts:281](https://github.com/Nick2bad4u/dnsValidator/blob/main/src/types.ts#L281)

DS record - Delegation Signer, used to secure delegations between DNS zones.

## Example

```typescript
const record: DSRecord = {
    type: "DS",
    keyTag: 12345,
    algorithm: 8, // RSA/SHA-256
    digestType: 2, // SHA-256
    digest: "A1B2C3D4E5F6...",
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

Defined in: [types.ts:283](https://github.com/Nick2bad4u/dnsValidator/blob/main/src/types.ts#L283)

Cryptographic algorithm of the referenced key

***

### digest

> **digest**: `string`

Defined in: [types.ts:285](https://github.com/Nick2bad4u/dnsValidator/blob/main/src/types.ts#L285)

Hexadecimal digest of the DNSKEY record

***

### digestType

> **digestType**: `number`

Defined in: [types.ts:287](https://github.com/Nick2bad4u/dnsValidator/blob/main/src/types.ts#L287)

Digest algorithm used to create the digest

***

### keyTag

> **keyTag**: `number`

Defined in: [types.ts:289](https://github.com/Nick2bad4u/dnsValidator/blob/main/src/types.ts#L289)

Key tag of the referenced DNSKEY record

***

### type

> **type**: `"DS"`

Defined in: [types.ts:290](https://github.com/Nick2bad4u/dnsValidator/blob/main/src/types.ts#L290)

The type of DNS record

#### Overrides

[`BaseDNSRecord`](BaseDNSRecord.md).[`type`](BaseDNSRecord.md#type)
