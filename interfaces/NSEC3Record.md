# Interface: NSEC3Record

Defined in: [types.ts:534](https://github.com/Nick2bad4u/dnsValidator/blob/main/src/types.ts#L534)

NSEC3 record - Next Secure version 3, provides authenticated denial of existence with hashed names.

## Example

```typescript
const record: NSEC3Record = {
  type: 'NSEC3',
  hashAlgorithm: 1, // SHA-1
  flags: 0,
  iterations: 12,
  salt: 'aabbccdd',
  nextHashedOwnerName: 'p0llp5g0r78e008k65jk5u69i5smp0n8',
  typeBitMaps: ['A', 'RRSIG'],
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

> **type**: `"NSEC3"`

Defined in: [types.ts:535](https://github.com/Nick2bad4u/dnsValidator/blob/main/src/types.ts#L535)

The type of DNS record

#### Overrides

[`BaseDNSRecord`](BaseDNSRecord.md).[`type`](BaseDNSRecord.md#type)

***

### hashAlgorithm

> **hashAlgorithm**: `number`

Defined in: [types.ts:537](https://github.com/Nick2bad4u/dnsValidator/blob/main/src/types.ts#L537)

Hash algorithm used

***

### flags

> **flags**: `number`

Defined in: [types.ts:539](https://github.com/Nick2bad4u/dnsValidator/blob/main/src/types.ts#L539)

Flags field

***

### iterations

> **iterations**: `number`

Defined in: [types.ts:541](https://github.com/Nick2bad4u/dnsValidator/blob/main/src/types.ts#L541)

Number of hash iterations

***

### salt

> **salt**: `string`

Defined in: [types.ts:543](https://github.com/Nick2bad4u/dnsValidator/blob/main/src/types.ts#L543)

Salt value in hexadecimal

***

### nextHashedOwnerName

> **nextHashedOwnerName**: `string`

Defined in: [types.ts:545](https://github.com/Nick2bad4u/dnsValidator/blob/main/src/types.ts#L545)

Next hashed owner name in base32hex

***

### typeBitMaps

> **typeBitMaps**: `string`[]

Defined in: [types.ts:547](https://github.com/Nick2bad4u/dnsValidator/blob/main/src/types.ts#L547)

Array of record types that exist at this name

***

### ~~types?~~

> `optional` **types**: `string`[]

Defined in: [types.ts:549](https://github.com/Nick2bad4u/dnsValidator/blob/main/src/types.ts#L549)

#### Deprecated

Use typeBitMaps instead
