# Interface: ARecord

Defined in: [types.ts:59](https://github.com/Nick2bad4u/dnsValidator/blob/main/src/types.ts#L59)

A record - Maps a domain name to an IPv4 address.

## Example

```typescript
const record: ARecord = {
  type: 'A',
  address: '192.168.1.1',
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

> **type**: `"A"`

Defined in: [types.ts:60](https://github.com/Nick2bad4u/dnsValidator/blob/main/src/types.ts#L60)

The type of DNS record

#### Overrides

[`BaseDNSRecord`](BaseDNSRecord.md).[`type`](BaseDNSRecord.md#type)

***

### address

> **address**: `string`

Defined in: [types.ts:62](https://github.com/Nick2bad4u/dnsValidator/blob/main/src/types.ts#L62)

IPv4 address in dotted decimal notation
