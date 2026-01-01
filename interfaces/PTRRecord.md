# Interface: PTRRecord

Defined in: [types.ts:182](https://github.com/Nick2bad4u/dnsValidator/blob/main/src/types.ts#L182)

PTR record - Maps an IP address to a domain name (reverse DNS).

## Example

```typescript
const record: PTRRecord = {
  type: 'PTR',
  value: 'host.example.com',
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

> **type**: `"PTR"`

Defined in: [types.ts:183](https://github.com/Nick2bad4u/dnsValidator/blob/main/src/types.ts#L183)

The type of DNS record

#### Overrides

[`BaseDNSRecord`](BaseDNSRecord.md).[`type`](BaseDNSRecord.md#type)

***

### value

> **value**: `string`

Defined in: [types.ts:185](https://github.com/Nick2bad4u/dnsValidator/blob/main/src/types.ts#L185)

Domain name
