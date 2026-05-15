# Interface: PTRRecord

Defined in: [types.ts:488](https://github.com/Nick2bad4u/dnsValidator/blob/main/src/types.ts#L488)

PTR record - Maps an IP address to a domain name (reverse DNS).

## Example

```typescript
const record: PTRRecord = {
    type: "PTR",
    value: "host.example.com",
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

### type

> **type**: `"PTR"`

Defined in: [types.ts:489](https://github.com/Nick2bad4u/dnsValidator/blob/main/src/types.ts#L489)

The type of DNS record

#### Overrides

[`BaseDNSRecord`](BaseDNSRecord.md).[`type`](BaseDNSRecord.md#type)

***

### value

> **value**: `string`

Defined in: [types.ts:491](https://github.com/Nick2bad4u/dnsValidator/blob/main/src/types.ts#L491)

Domain name
