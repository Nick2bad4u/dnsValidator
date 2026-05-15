# Interface: SRVRecord

Defined in: [types.ts:614](https://github.com/Nick2bad4u/dnsValidator/blob/main/src/types.ts#L614)

SRV record - Specifies the location of services within a domain.

## Example

```typescript
const record: SRVRecord = {
    type: "SRV",
    priority: 10,
    weight: 5,
    port: 443,
    name: "server.example.com",
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

### name

> **name**: `string`

Defined in: [types.ts:616](https://github.com/Nick2bad4u/dnsValidator/blob/main/src/types.ts#L616)

Hostname of the target

***

### port

> **port**: `number`

Defined in: [types.ts:618](https://github.com/Nick2bad4u/dnsValidator/blob/main/src/types.ts#L618)

Port number of the service

***

### priority

> **priority**: `number`

Defined in: [types.ts:620](https://github.com/Nick2bad4u/dnsValidator/blob/main/src/types.ts#L620)

Priority of the target host (0-65535, lower values preferred)

***

### type

> **type**: `"SRV"`

Defined in: [types.ts:621](https://github.com/Nick2bad4u/dnsValidator/blob/main/src/types.ts#L621)

The type of DNS record

#### Overrides

[`BaseDNSRecord`](BaseDNSRecord.md).[`type`](BaseDNSRecord.md#type)

***

### weight

> **weight**: `number`

Defined in: [types.ts:623](https://github.com/Nick2bad4u/dnsValidator/blob/main/src/types.ts#L623)

Weight for load balancing among hosts with same priority
