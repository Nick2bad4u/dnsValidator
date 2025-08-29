# Interface: TLSARecord

Defined in: [types.ts:352](https://github.com/Nick2bad4u/dnsValidator/blob/main/src/types.ts#L352)

TLSA record - DNS-based Authentication of Named Entities (DANE).

Associates a TLS server certificate with the domain name where the record is found.

## Example

```typescript
const record: TLSARecord = {
  type: 'TLSA',
  usage: 3,
  selector: 1,
  matchingType: 1,
  certificate: 'abcdef1234567890...',
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

> **type**: `"TLSA"`

Defined in: [types.ts:353](https://github.com/Nick2bad4u/dnsValidator/blob/main/src/types.ts#L353)

The type of DNS record

#### Overrides

[`BaseDNSRecord`](BaseDNSRecord.md).[`type`](BaseDNSRecord.md#type)

***

### usage?

> `optional` **usage**: `number`

Defined in: [types.ts:355](https://github.com/Nick2bad4u/dnsValidator/blob/main/src/types.ts#L355)

Certificate usage (0-3) internal canonical (Node uses 'certUsage')

***

### certUsage?

> `optional` **certUsage**: `number`

Defined in: [types.ts:357](https://github.com/Nick2bad4u/dnsValidator/blob/main/src/types.ts#L357)

Node.js compatible certificate usage

***

### selector

> **selector**: `number`

Defined in: [types.ts:359](https://github.com/Nick2bad4u/dnsValidator/blob/main/src/types.ts#L359)

Selector (0-1)

***

### matchingType?

> `optional` **matchingType**: `number`

Defined in: [types.ts:361](https://github.com/Nick2bad4u/dnsValidator/blob/main/src/types.ts#L361)

Matching type (0-2) internal canonical (Node uses 'match')

***

### match?

> `optional` **match**: `number`

Defined in: [types.ts:363](https://github.com/Nick2bad4u/dnsValidator/blob/main/src/types.ts#L363)

Node.js compatible matching type

***

### certificate?

> `optional` **certificate**: `string`

Defined in: [types.ts:365](https://github.com/Nick2bad4u/dnsValidator/blob/main/src/types.ts#L365)

Certificate association data internal canonical (Node uses 'data' as ArrayBuffer/Buffer)

***

### data?

> `optional` **data**: `string` \| `ArrayBuffer` \| `Uint8Array`\<`ArrayBufferLike`\>

Defined in: [types.ts:367](https://github.com/Nick2bad4u/dnsValidator/blob/main/src/types.ts#L367)

Node.js compatible data (hex/base64 string or Buffer)
