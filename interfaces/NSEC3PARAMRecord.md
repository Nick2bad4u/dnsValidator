# Interface: NSEC3PARAMRecord

Defined in: [types.ts:569](https://github.com/Nick2bad4u/dnsValidator/blob/main/src/types.ts#L569)

NSEC3PARAM record - Provides NSEC3 hashing parameters for a DNS zone.

## Example

```typescript
const record: NSEC3PARAMRecord = {
  type: 'NSEC3PARAM',
  hashAlgorithm: 1,
  flags: 0,
  iterations: 12,
  salt: 'aabbccdd',
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

> **type**: `"NSEC3PARAM"`

Defined in: [types.ts:570](https://github.com/Nick2bad4u/dnsValidator/blob/main/src/types.ts#L570)

The type of DNS record

#### Overrides

[`BaseDNSRecord`](BaseDNSRecord.md).[`type`](BaseDNSRecord.md#type)

***

### hashAlgorithm

> **hashAlgorithm**: `number`

Defined in: [types.ts:572](https://github.com/Nick2bad4u/dnsValidator/blob/main/src/types.ts#L572)

Hash algorithm used (currently 1 = SHA-1)

***

### flags

> **flags**: `number`

Defined in: [types.ts:574](https://github.com/Nick2bad4u/dnsValidator/blob/main/src/types.ts#L574)

Flags field

***

### iterations

> **iterations**: `number`

Defined in: [types.ts:576](https://github.com/Nick2bad4u/dnsValidator/blob/main/src/types.ts#L576)

Number of hash iterations

***

### salt

> **salt**: `string`

Defined in: [types.ts:578](https://github.com/Nick2bad4u/dnsValidator/blob/main/src/types.ts#L578)

Salt value in hexadecimal or empty string for none
