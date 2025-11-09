# Interface: MXRecord

Defined in: [types.ts:120](https://github.com/Nick2bad4u/dnsValidator/blob/main/src/types.ts#L120)

MX record - Specifies mail exchange servers for a domain.

## Example

```typescript
const record: MXRecord = {
  type: 'MX',
  priority: 10,
  exchange: 'mail.example.com',
  ttl: 3600
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

> **type**: `"MX"`

Defined in: [types.ts:121](https://github.com/Nick2bad4u/dnsValidator/blob/main/src/types.ts#L121)

The type of DNS record

#### Overrides

[`BaseDNSRecord`](BaseDNSRecord.md).[`type`](BaseDNSRecord.md#type)

***

### priority

> **priority**: `number`

Defined in: [types.ts:123](https://github.com/Nick2bad4u/dnsValidator/blob/main/src/types.ts#L123)

Priority value (0-65535, lower values have higher priority)

***

### exchange

> **exchange**: `string`

Defined in: [types.ts:125](https://github.com/Nick2bad4u/dnsValidator/blob/main/src/types.ts#L125)

Mail server hostname
