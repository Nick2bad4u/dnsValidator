# Interface: ANYRecord

Defined in: [types.ts:38](https://github.com/Nick2bad4u/dnsValidator/blob/main/src/types.ts#L38)

ANY record - Represents a query for any type of DNS record.

## Example

```typescript
const record: ANYRecord = {
    type: "ANY",
    ttl: 300,
};
```

## Extends

- [`BaseDNSRecord`](BaseDNSRecord.md)

## Properties

### records?

> `optional` **records?**: `UnknownRecord`[]

Defined in: [types.ts:40](https://github.com/Nick2bad4u/dnsValidator/blob/main/src/types.ts#L40)

Optional collection of mixed record results (Node resolveAny style)

***

### type

> **type**: `"ANY"`

Defined in: [types.ts:41](https://github.com/Nick2bad4u/dnsValidator/blob/main/src/types.ts#L41)

The type of DNS record

#### Overrides

[`BaseDNSRecord`](BaseDNSRecord.md).[`type`](BaseDNSRecord.md#type)

***

### value?

> `optional` **value?**: `unknown`

Defined in: [types.ts:43](https://github.com/Nick2bad4u/dnsValidator/blob/main/src/types.ts#L43)

Raw value (deprecated - prefer specific typed arrays)

***

### ttl?

> `optional` **ttl?**: `number`

Defined in: [types.ts:76](https://github.com/Nick2bad4u/dnsValidator/blob/main/src/types.ts#L76)

Time to live in seconds (optional)

#### Inherited from

[`BaseDNSRecord`](BaseDNSRecord.md).[`ttl`](BaseDNSRecord.md#ttl)
