# Interface: SRVRecord

Defined in: [types.ts:251](https://github.com/Nick2bad4u/dnsValidator/blob/main/src/types.ts#L251)

SRV record - Specifies the location of services within a domain.

## Example

```typescript
const record: SRVRecord = {
  type: 'SRV',
  priority: 10,
  weight: 5,
  port: 443,
  name: 'server.example.com',
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

> **type**: `"SRV"`

Defined in: [types.ts:252](https://github.com/Nick2bad4u/dnsValidator/blob/main/src/types.ts#L252)

The type of DNS record

#### Overrides

[`BaseDNSRecord`](BaseDNSRecord.md).[`type`](BaseDNSRecord.md#type)

***

### priority

> **priority**: `number`

Defined in: [types.ts:254](https://github.com/Nick2bad4u/dnsValidator/blob/main/src/types.ts#L254)

Priority of the target host (0-65535, lower values preferred)

***

### weight

> **weight**: `number`

Defined in: [types.ts:256](https://github.com/Nick2bad4u/dnsValidator/blob/main/src/types.ts#L256)

Weight for load balancing among hosts with same priority

***

### port

> **port**: `number`

Defined in: [types.ts:258](https://github.com/Nick2bad4u/dnsValidator/blob/main/src/types.ts#L258)

Port number of the service

***

### name

> **name**: `string`

Defined in: [types.ts:260](https://github.com/Nick2bad4u/dnsValidator/blob/main/src/types.ts#L260)

Hostname of the target
