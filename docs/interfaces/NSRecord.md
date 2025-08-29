# Interface: NSRecord

Defined in: [types.ts:162](https://github.com/Nick2bad4u/dnsValidator/blob/main/src/types.ts#L162)

NS record - Specifies authoritative name servers for a domain.

## Example

```typescript
const record: NSRecord = {
  type: 'NS',
  value: 'ns1.example.com',
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

> **type**: `"NS"`

Defined in: [types.ts:163](https://github.com/Nick2bad4u/dnsValidator/blob/main/src/types.ts#L163)

The type of DNS record

#### Overrides

[`BaseDNSRecord`](BaseDNSRecord.md).[`type`](BaseDNSRecord.md#type)

***

### value

> **value**: `string`

Defined in: [types.ts:165](https://github.com/Nick2bad4u/dnsValidator/blob/main/src/types.ts#L165)

Name server hostname
