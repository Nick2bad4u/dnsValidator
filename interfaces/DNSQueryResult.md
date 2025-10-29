# Interface: DNSQueryResult

Defined in: [types.ts:700](https://github.com/Nick2bad4u/dnsValidator/blob/main/src/types.ts#L700)

DNS query result interface representing a complete DNS response.

## Example

```typescript
const result: DNSQueryResult = {
  question: {
    name: 'example.com',
    type: 'A',
    class: 'IN'
  },
  answers: [
    { type: 'A', address: '93.184.216.34', ttl: 86400 }
  ]
};
```

## Properties

### question

> **question**: `object`

Defined in: [types.ts:702](https://github.com/Nick2bad4u/dnsValidator/blob/main/src/types.ts#L702)

The question section of the DNS query

#### name

> **name**: `string`

Domain name being queried

#### type

> **type**: [`DNSRecordType`](../type-aliases/DNSRecordType.md)

Type of record requested

#### class

> **class**: `string`

Query class (usually 'IN' for Internet)

***

### answers

> **answers**: [`DNSRecord`](../type-aliases/DNSRecord.md)[]

Defined in: [types.ts:711](https://github.com/Nick2bad4u/dnsValidator/blob/main/src/types.ts#L711)

Answer records from the DNS response

***

### authority?

> `optional` **authority**: [`DNSRecord`](../type-aliases/DNSRecord.md)[]

Defined in: [types.ts:713](https://github.com/Nick2bad4u/dnsValidator/blob/main/src/types.ts#L713)

Authority records (optional)

***

### additional?

> `optional` **additional**: [`DNSRecord`](../type-aliases/DNSRecord.md)[]

Defined in: [types.ts:715](https://github.com/Nick2bad4u/dnsValidator/blob/main/src/types.ts#L715)

Additional records (optional)
