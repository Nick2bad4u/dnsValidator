# Interface: SOARecord

Defined in: [types.ts:208](https://github.com/Nick2bad4u/dnsValidator/blob/main/src/types.ts#L208)

SOA record - Contains administrative information about a DNS zone.

## Example

```typescript
const record: SOARecord = {
  type: 'SOA',
  primary: 'ns1.example.com',
  admin: 'admin.example.com',
  serial: 2023010101,
  refresh: 3600,
  retry: 1800,
  expiration: 604800,
  minimum: 86400,
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

> **type**: `"SOA"`

Defined in: [types.ts:209](https://github.com/Nick2bad4u/dnsValidator/blob/main/src/types.ts#L209)

The type of DNS record

#### Overrides

[`BaseDNSRecord`](BaseDNSRecord.md).[`type`](BaseDNSRecord.md#type)

***

### primary?

> `optional` **primary**: `string`

Defined in: [types.ts:211](https://github.com/Nick2bad4u/dnsValidator/blob/main/src/types.ts#L211)

Primary name server (internal canonical field, Node.js dns.resolveSoa uses 'nsname')

***

### nsname?

> `optional` **nsname**: `string`

Defined in: [types.ts:213](https://github.com/Nick2bad4u/dnsValidator/blob/main/src/types.ts#L213)

Node.js compatible field name for primary name server

***

### admin?

> `optional` **admin**: `string`

Defined in: [types.ts:215](https://github.com/Nick2bad4u/dnsValidator/blob/main/src/types.ts#L215)

Administrator email (with @ replaced by .) (internal canonical field, Node uses 'hostmaster')

***

### hostmaster?

> `optional` **hostmaster**: `string`

Defined in: [types.ts:217](https://github.com/Nick2bad4u/dnsValidator/blob/main/src/types.ts#L217)

Node.js compatible field name for administrator email

***

### serial

> **serial**: `number`

Defined in: [types.ts:219](https://github.com/Nick2bad4u/dnsValidator/blob/main/src/types.ts#L219)

Serial number for zone transfers

***

### refresh

> **refresh**: `number`

Defined in: [types.ts:221](https://github.com/Nick2bad4u/dnsValidator/blob/main/src/types.ts#L221)

Refresh interval in seconds

***

### retry

> **retry**: `number`

Defined in: [types.ts:223](https://github.com/Nick2bad4u/dnsValidator/blob/main/src/types.ts#L223)

Retry interval in seconds

***

### expiration?

> `optional` **expiration**: `number`

Defined in: [types.ts:225](https://github.com/Nick2bad4u/dnsValidator/blob/main/src/types.ts#L225)

Expiration time in seconds (internal canonical field, Node uses 'expire')

***

### expire?

> `optional` **expire**: `number`

Defined in: [types.ts:227](https://github.com/Nick2bad4u/dnsValidator/blob/main/src/types.ts#L227)

Node.js compatible expiration field

***

### minimum?

> `optional` **minimum**: `number`

Defined in: [types.ts:229](https://github.com/Nick2bad4u/dnsValidator/blob/main/src/types.ts#L229)

Minimum TTL for negative caching (internal canonical field, Node uses 'minttl')

***

### minttl?

> `optional` **minttl**: `number`

Defined in: [types.ts:231](https://github.com/Nick2bad4u/dnsValidator/blob/main/src/types.ts#L231)

Node.js compatible minimum TTL field
