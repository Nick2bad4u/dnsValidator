# Interface: ARecord

Defined in: [types.ts:61](https://github.com/Nick2bad4u/dnsValidator/blob/main/src/types.ts#L61)

A record - Maps a domain name to an IPv4 address.

## Example

```typescript
const record: ARecord = {
    type: "A",
    address: "192.168.1.1",
    ttl: 300,
};
```

## Extends

- [`BaseDNSRecord`](BaseDNSRecord.md)

## Properties

### address

> **address**: `string`

Defined in: [types.ts:63](https://github.com/Nick2bad4u/dnsValidator/blob/main/src/types.ts#L63)

IPv4 address in dotted decimal notation

***

### type

> **type**: `"A"`

Defined in: [types.ts:64](https://github.com/Nick2bad4u/dnsValidator/blob/main/src/types.ts#L64)

The type of DNS record

#### Overrides

[`BaseDNSRecord`](BaseDNSRecord.md).[`type`](BaseDNSRecord.md#type)

***

### ttl?

> `optional` **ttl?**: `number`

Defined in: [types.ts:76](https://github.com/Nick2bad4u/dnsValidator/blob/main/src/types.ts#L76)

Time to live in seconds (optional)

#### Inherited from

[`BaseDNSRecord`](BaseDNSRecord.md).[`ttl`](BaseDNSRecord.md#ttl)
