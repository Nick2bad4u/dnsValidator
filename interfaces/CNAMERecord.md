# Interface: CNAMERecord

Defined in: [types.ts:99](https://github.com/Nick2bad4u/dnsValidator/blob/main/src/types.ts#L99)

CNAME record - Maps an alias name to the canonical domain name.

## Example

```typescript
const record: CNAMERecord = {
  type: 'CNAME',
  value: 'canonical.example.com',
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

> **type**: `"CNAME"`

Defined in: [types.ts:100](https://github.com/Nick2bad4u/dnsValidator/blob/main/src/types.ts#L100)

The type of DNS record

#### Overrides

[`BaseDNSRecord`](BaseDNSRecord.md).[`type`](BaseDNSRecord.md#type)

***

### value

> **value**: `string`

Defined in: [types.ts:102](https://github.com/Nick2bad4u/dnsValidator/blob/main/src/types.ts#L102)

The canonical domain name
