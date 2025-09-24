# Interface: AAAARecord

Defined in: [types.ts:79](https://github.com/Nick2bad4u/dnsValidator/blob/main/src/types.ts#L79)

AAAA record - Maps a domain name to an IPv6 address.

## Example

```typescript
const record: AAAARecord = {
  type: 'AAAA',
  address: '2001:db8::1',
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

> **type**: `"AAAA"`

Defined in: [types.ts:80](https://github.com/Nick2bad4u/dnsValidator/blob/main/src/types.ts#L80)

The type of DNS record

#### Overrides

[`BaseDNSRecord`](BaseDNSRecord.md).[`type`](BaseDNSRecord.md#type)

***

### address

> **address**: `string`

Defined in: [types.ts:82](https://github.com/Nick2bad4u/dnsValidator/blob/main/src/types.ts#L82)

IPv6 address in colon-separated hexadecimal notation
