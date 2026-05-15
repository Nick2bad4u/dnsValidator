# Interface: CNAMERecord

Defined in: [types.ts:131](https://github.com/Nick2bad4u/dnsValidator/blob/main/src/types.ts#L131)

CNAME record - Maps an alias name to the canonical domain name.

## Example

```typescript
const record: CNAMERecord = {
    type: "CNAME",
    value: "canonical.example.com",
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

> **type**: `"CNAME"`

Defined in: [types.ts:132](https://github.com/Nick2bad4u/dnsValidator/blob/main/src/types.ts#L132)

The type of DNS record

#### Overrides

[`BaseDNSRecord`](BaseDNSRecord.md).[`type`](BaseDNSRecord.md#type)

***

### value

> **value**: `string`

Defined in: [types.ts:134](https://github.com/Nick2bad4u/dnsValidator/blob/main/src/types.ts#L134)

The canonical domain name
