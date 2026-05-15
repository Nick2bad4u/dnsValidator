# Interface: NSECRecord

Defined in: [types.ts:442](https://github.com/Nick2bad4u/dnsValidator/blob/main/src/types.ts#L442)

NSEC record - Next Secure, used for authenticated denial of existence in
DNSSEC.

## Example

```typescript
const record: NSECRecord = {
    type: "NSEC",
    nextDomainName: "b.example.com",
    typeBitmaps: "A NS SOA MX RRSIG NSEC DNSKEY",
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

### nextDomainName

> **nextDomainName**: `string`

Defined in: [types.ts:444](https://github.com/Nick2bad4u/dnsValidator/blob/main/src/types.ts#L444)

Next domain name in canonical ordering

***

### type

> **type**: `"NSEC"`

Defined in: [types.ts:445](https://github.com/Nick2bad4u/dnsValidator/blob/main/src/types.ts#L445)

The type of DNS record

#### Overrides

[`BaseDNSRecord`](BaseDNSRecord.md).[`type`](BaseDNSRecord.md#type)

***

### typeBitMaps

> **typeBitMaps**: `string`[]

Defined in: [types.ts:447](https://github.com/Nick2bad4u/dnsValidator/blob/main/src/types.ts#L447)

Array of record types that exist at this name

***

### ~~types?~~

> `optional` **types?**: `string`[]

Defined in: [types.ts:449](https://github.com/Nick2bad4u/dnsValidator/blob/main/src/types.ts#L449)

#### Deprecated

Use typeBitMaps instead
