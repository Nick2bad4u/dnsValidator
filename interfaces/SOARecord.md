# Interface: SOARecord

Defined in: [types.ts:561](https://github.com/Nick2bad4u/dnsValidator/blob/main/src/types.ts#L561)

SOA record - Contains administrative information about a DNS zone.

## Example

```typescript
const record: SOARecord = {
    type: "SOA",
    primary: "ns1.example.com",
    admin: "admin.example.com",
    serial: 2023010101,
    refresh: 3600,
    retry: 1800,
    expiration: 604800,
    minimum: 86400,
    ttl: 86400,
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

### admin?

> `optional` **admin?**: `string`

Defined in: [types.ts:566](https://github.com/Nick2bad4u/dnsValidator/blob/main/src/types.ts#L566)

Administrator email (with the at sign replaced by .) (internal canonical
field, Node uses 'hostmaster')

***

### expiration?

> `optional` **expiration?**: `number`

Defined in: [types.ts:568](https://github.com/Nick2bad4u/dnsValidator/blob/main/src/types.ts#L568)

Expiration time in seconds (internal canonical field, Node uses 'expire')

***

### expire?

> `optional` **expire?**: `number`

Defined in: [types.ts:570](https://github.com/Nick2bad4u/dnsValidator/blob/main/src/types.ts#L570)

Node.js compatible expiration field

***

### hostmaster?

> `optional` **hostmaster?**: `string`

Defined in: [types.ts:572](https://github.com/Nick2bad4u/dnsValidator/blob/main/src/types.ts#L572)

Node.js compatible field name for administrator email

***

### minimum?

> `optional` **minimum?**: `number`

Defined in: [types.ts:577](https://github.com/Nick2bad4u/dnsValidator/blob/main/src/types.ts#L577)

Minimum TTL for negative caching (internal canonical field, Node uses
'minttl')

***

### minttl?

> `optional` **minttl?**: `number`

Defined in: [types.ts:579](https://github.com/Nick2bad4u/dnsValidator/blob/main/src/types.ts#L579)

Node.js compatible minimum TTL field

***

### nsname?

> `optional` **nsname?**: `string`

Defined in: [types.ts:581](https://github.com/Nick2bad4u/dnsValidator/blob/main/src/types.ts#L581)

Node.js compatible field name for primary name server

***

### primary?

> `optional` **primary?**: `string`

Defined in: [types.ts:586](https://github.com/Nick2bad4u/dnsValidator/blob/main/src/types.ts#L586)

Primary name server (internal canonical field, Node.js dns.resolveSoa
uses 'nsname')

***

### refresh

> **refresh**: `number`

Defined in: [types.ts:588](https://github.com/Nick2bad4u/dnsValidator/blob/main/src/types.ts#L588)

Refresh interval in seconds

***

### retry

> **retry**: `number`

Defined in: [types.ts:590](https://github.com/Nick2bad4u/dnsValidator/blob/main/src/types.ts#L590)

Retry interval in seconds

***

### serial

> **serial**: `number`

Defined in: [types.ts:592](https://github.com/Nick2bad4u/dnsValidator/blob/main/src/types.ts#L592)

Serial number for zone transfers

***

### type

> **type**: `"SOA"`

Defined in: [types.ts:593](https://github.com/Nick2bad4u/dnsValidator/blob/main/src/types.ts#L593)

The type of DNS record

#### Overrides

[`BaseDNSRecord`](BaseDNSRecord.md).[`type`](BaseDNSRecord.md#type)
