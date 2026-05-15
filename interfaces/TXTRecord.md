# Interface: TXTRecord

Defined in: [types.ts:711](https://github.com/Nick2bad4u/dnsValidator/blob/main/src/types.ts#L711)

TXT record - Contains arbitrary text data.

## Example

```typescript
const record: TXTRecord = {
    type: "TXT",
    entries: ["v=spf1 include:_spf.google.com ~all"],
    ttl: 300,
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

### entries

> **entries**: `string`[]

Defined in: [types.ts:713](https://github.com/Nick2bad4u/dnsValidator/blob/main/src/types.ts#L713)

Array of text strings

***

### type

> **type**: `"TXT"`

Defined in: [types.ts:714](https://github.com/Nick2bad4u/dnsValidator/blob/main/src/types.ts#L714)

The type of DNS record

#### Overrides

[`BaseDNSRecord`](BaseDNSRecord.md).[`type`](BaseDNSRecord.md#type)
