# Interface: TLSARecord

Defined in: [types.ts:675](https://github.com/Nick2bad4u/dnsValidator/blob/main/src/types.ts#L675)

TLSA record - DNS-based Authentication of Named Entities (DANE).

Associates a TLS server certificate with the domain name where the record is
found.

## Example

```typescript
const record: TLSARecord = {
    type: "TLSA",
    usage: 3,
    selector: 1,
    matchingType: 1,
    certificate: "abcdef1234567890...",
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

### certificate?

> `optional` **certificate?**: `string`

Defined in: [types.ts:680](https://github.com/Nick2bad4u/dnsValidator/blob/main/src/types.ts#L680)

Certificate association data internal canonical (Node uses 'data' as
ArrayBuffer/Buffer)

***

### certUsage?

> `optional` **certUsage?**: `number`

Defined in: [types.ts:682](https://github.com/Nick2bad4u/dnsValidator/blob/main/src/types.ts#L682)

Node.js compatible certificate usage

***

### data?

> `optional` **data?**: `string` \| `ArrayBuffer` \| `Uint8Array`\<`ArrayBufferLike`\>

Defined in: [types.ts:684](https://github.com/Nick2bad4u/dnsValidator/blob/main/src/types.ts#L684)

Node.js compatible data (hex/base64 string or Buffer)

***

### match?

> `optional` **match?**: `number`

Defined in: [types.ts:686](https://github.com/Nick2bad4u/dnsValidator/blob/main/src/types.ts#L686)

Node.js compatible matching type

***

### matchingType?

> `optional` **matchingType?**: `number`

Defined in: [types.ts:688](https://github.com/Nick2bad4u/dnsValidator/blob/main/src/types.ts#L688)

Matching type (0-2) internal canonical (Node uses 'match')

***

### selector

> **selector**: `number`

Defined in: [types.ts:690](https://github.com/Nick2bad4u/dnsValidator/blob/main/src/types.ts#L690)

Selector (0-1)

***

### type

> **type**: `"TLSA"`

Defined in: [types.ts:691](https://github.com/Nick2bad4u/dnsValidator/blob/main/src/types.ts#L691)

The type of DNS record

#### Overrides

[`BaseDNSRecord`](BaseDNSRecord.md).[`type`](BaseDNSRecord.md#type)

***

### usage?

> `optional` **usage?**: `number`

Defined in: [types.ts:693](https://github.com/Nick2bad4u/dnsValidator/blob/main/src/types.ts#L693)

Certificate usage (0-3) internal canonical (Node uses 'certUsage')
