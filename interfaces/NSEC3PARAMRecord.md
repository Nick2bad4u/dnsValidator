# Interface: NSEC3PARAMRecord

Defined in: [types.ts:374](https://github.com/Nick2bad4u/dnsValidator/blob/main/src/types.ts#L374)

NSEC3PARAM record - Provides NSEC3 hashing parameters for a DNS zone.

## Example

```typescript
const record: NSEC3PARAMRecord = {
    type: "NSEC3PARAM",
    hashAlgorithm: 1,
    flags: 0,
    iterations: 12,
    salt: "aabbccdd",
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

### flags

> **flags**: `number`

Defined in: [types.ts:376](https://github.com/Nick2bad4u/dnsValidator/blob/main/src/types.ts#L376)

Flags field

***

### hashAlgorithm

> **hashAlgorithm**: `number`

Defined in: [types.ts:378](https://github.com/Nick2bad4u/dnsValidator/blob/main/src/types.ts#L378)

Hash algorithm used (currently 1 = SHA-1)

***

### iterations

> **iterations**: `number`

Defined in: [types.ts:380](https://github.com/Nick2bad4u/dnsValidator/blob/main/src/types.ts#L380)

Number of hash iterations

***

### salt

> **salt**: `string`

Defined in: [types.ts:382](https://github.com/Nick2bad4u/dnsValidator/blob/main/src/types.ts#L382)

Salt value in hexadecimal or empty string for none

***

### type

> **type**: `"NSEC3PARAM"`

Defined in: [types.ts:383](https://github.com/Nick2bad4u/dnsValidator/blob/main/src/types.ts#L383)

The type of DNS record

#### Overrides

[`BaseDNSRecord`](BaseDNSRecord.md).[`type`](BaseDNSRecord.md#type)
