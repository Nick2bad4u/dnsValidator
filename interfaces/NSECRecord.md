# Interface: NSECRecord

Defined in: [types.ts:505](https://github.com/Nick2bad4u/dnsValidator/blob/main/src/types.ts#L505)

NSEC record - Next Secure, used for authenticated denial of existence in DNSSEC.

## Example

```typescript
const record: NSECRecord = {
  type: 'NSEC',
  nextDomainName: 'b.example.com',
  typeBitmaps: 'A NS SOA MX RRSIG NSEC DNSKEY',
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

> **type**: `"NSEC"`

Defined in: [types.ts:506](https://github.com/Nick2bad4u/dnsValidator/blob/main/src/types.ts#L506)

The type of DNS record

#### Overrides

[`BaseDNSRecord`](BaseDNSRecord.md).[`type`](BaseDNSRecord.md#type)

***

### nextDomainName

> **nextDomainName**: `string`

Defined in: [types.ts:508](https://github.com/Nick2bad4u/dnsValidator/blob/main/src/types.ts#L508)

Next domain name in canonical ordering

***

### typeBitMaps

> **typeBitMaps**: `string`[]

Defined in: [types.ts:510](https://github.com/Nick2bad4u/dnsValidator/blob/main/src/types.ts#L510)

Array of record types that exist at this name

***

### ~~types?~~

> `optional` **types**: `string`[]

Defined in: [types.ts:512](https://github.com/Nick2bad4u/dnsValidator/blob/main/src/types.ts#L512)

#### Deprecated

Use typeBitMaps instead
