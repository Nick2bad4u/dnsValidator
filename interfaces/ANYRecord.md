# Interface: ANYRecord

Defined in: [types.ts:383](https://github.com/Nick2bad4u/dnsValidator/blob/main/src/types.ts#L383)

ANY record - Represents a query for any type of DNS record.

## Example

```typescript
const record: ANYRecord = {
  type: 'ANY',
  ttl: 300
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

> **type**: `"ANY"`

Defined in: [types.ts:384](https://github.com/Nick2bad4u/dnsValidator/blob/main/src/types.ts#L384)

The type of DNS record

#### Overrides

[`BaseDNSRecord`](BaseDNSRecord.md).[`type`](BaseDNSRecord.md#type)

***

### value?

> `optional` **value**: `unknown`

Defined in: [types.ts:386](https://github.com/Nick2bad4u/dnsValidator/blob/main/src/types.ts#L386)

Raw value (deprecated - prefer specific typed arrays)

***

### records?

> `optional` **records**: (\{ `type`: `"A"`; `address`: `string`; `ttl?`: `number`; \} \| \{ `type`: `"AAAA"`; `address`: `string`; `ttl?`: `number`; \} \| \{ `type`: `"CNAME"`; `value`: `string`; \} \| \{ `type`: `"MX"`; `exchange`: `string`; `priority`: `number`; \} \| \{ `type`: `"NAPTR"`; `flags`: `string`; `service`: `string`; `regexp`: `string`; `replacement`: `string`; `order`: `number`; `preference`: `number`; \} \| \{ `type`: `"NS"`; `value`: `string`; \} \| \{ `type`: `"PTR"`; `value`: `string`; \} \| \{ `type`: `"SOA"`; `nsname`: `string`; `hostmaster`: `string`; `serial`: `number`; `refresh`: `number`; `retry`: `number`; `expire`: `number`; `minttl`: `number`; \} \| \{ `type`: `"SRV"`; `priority`: `number`; `weight`: `number`; `port`: `number`; `name`: `string`; \} \| \{ `type`: `"TLSA"`; `certUsage`: `number`; `selector`: `number`; `match`: `number`; `data`: `string` \| `ArrayBuffer`; \} \| \{ `type`: `"TXT"`; `entries`: `string`[]; \})[]

Defined in: [types.ts:388](https://github.com/Nick2bad4u/dnsValidator/blob/main/src/types.ts#L388)

Optional collection of mixed record results (Node resolveAny style)
