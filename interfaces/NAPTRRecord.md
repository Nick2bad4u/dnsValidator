# Interface: NAPTRRecord

Defined in: [types.ts:317](https://github.com/Nick2bad4u/dnsValidator/blob/main/src/types.ts#L317)

NAPTR record - Naming Authority Pointer.

Used for mapping services to domain names, often in ENUM and SIP applications.

## Example

```typescript
const record: NAPTRRecord = {
  type: 'NAPTR',
  order: 100,
  preference: 50,
  flags: 'u',
  service: 'E2U+sip',
  regexp: '!^.*$!sip:info@example.com!',
  replacement: '',
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

> **type**: `"NAPTR"`

Defined in: [types.ts:318](https://github.com/Nick2bad4u/dnsValidator/blob/main/src/types.ts#L318)

The type of DNS record

#### Overrides

[`BaseDNSRecord`](BaseDNSRecord.md).[`type`](BaseDNSRecord.md#type)

***

### order

> **order**: `number`

Defined in: [types.ts:320](https://github.com/Nick2bad4u/dnsValidator/blob/main/src/types.ts#L320)

Order value for processing sequence

***

### preference

> **preference**: `number`

Defined in: [types.ts:322](https://github.com/Nick2bad4u/dnsValidator/blob/main/src/types.ts#L322)

Preference value within same order

***

### flags

> **flags**: `string`

Defined in: [types.ts:324](https://github.com/Nick2bad4u/dnsValidator/blob/main/src/types.ts#L324)

Flags controlling processing

***

### service

> **service**: `string`

Defined in: [types.ts:326](https://github.com/Nick2bad4u/dnsValidator/blob/main/src/types.ts#L326)

Service parameters

***

### regexp

> **regexp**: `string`

Defined in: [types.ts:328](https://github.com/Nick2bad4u/dnsValidator/blob/main/src/types.ts#L328)

Regular expression for URI construction

***

### replacement

> **replacement**: `string`

Defined in: [types.ts:330](https://github.com/Nick2bad4u/dnsValidator/blob/main/src/types.ts#L330)

Replacement domain name
