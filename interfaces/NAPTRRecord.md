# Interface: NAPTRRecord

Defined in: [types.ts:340](https://github.com/Nick2bad4u/dnsValidator/blob/main/src/types.ts#L340)

NAPTR record - Naming Authority Pointer.

Used for mapping services to domain names, often in ENUM and SIP
applications.

## Example

```typescript
const record: NAPTRRecord = {
    type: "NAPTR",
    order: 100,
    preference: 50,
    flags: "u",
    service: "E2U+sip",
    regexp: "!^.*$!sip:info@example.com!",
    replacement: "",
    ttl: 3600,
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

### flags

> **flags**: `string`

Defined in: [types.ts:342](https://github.com/Nick2bad4u/dnsValidator/blob/main/src/types.ts#L342)

Flags controlling processing

***

### order

> **order**: `number`

Defined in: [types.ts:344](https://github.com/Nick2bad4u/dnsValidator/blob/main/src/types.ts#L344)

Order value for processing sequence

***

### preference

> **preference**: `number`

Defined in: [types.ts:346](https://github.com/Nick2bad4u/dnsValidator/blob/main/src/types.ts#L346)

Preference value within same order

***

### regexp

> **regexp**: `string`

Defined in: [types.ts:348](https://github.com/Nick2bad4u/dnsValidator/blob/main/src/types.ts#L348)

Regular expression for URI construction

***

### replacement

> **replacement**: `string`

Defined in: [types.ts:350](https://github.com/Nick2bad4u/dnsValidator/blob/main/src/types.ts#L350)

Replacement domain name

***

### service

> **service**: `string`

Defined in: [types.ts:352](https://github.com/Nick2bad4u/dnsValidator/blob/main/src/types.ts#L352)

Service parameters

***

### type

> **type**: `"NAPTR"`

Defined in: [types.ts:353](https://github.com/Nick2bad4u/dnsValidator/blob/main/src/types.ts#L353)

The type of DNS record

#### Overrides

[`BaseDNSRecord`](BaseDNSRecord.md).[`type`](BaseDNSRecord.md#type)
