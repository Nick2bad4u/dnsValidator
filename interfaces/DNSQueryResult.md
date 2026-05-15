# Interface: DNSQueryResult

Defined in: [types.ts:185](https://github.com/Nick2bad4u/dnsValidator/blob/main/src/types.ts#L185)

DNS query result interface representing a complete DNS response.

## Example

```typescript
const result: DNSQueryResult = {
    question: {
        name: "example.com",
        type: "A",
        class: "IN",
    },
    answers: [{ type: "A", address: "93.184.216.34", ttl: 86400 }],
};
```

## Properties

### additional?

> `optional` **additional?**: [`DNSRecord`](../type-aliases/DNSRecord.md)[]

Defined in: [types.ts:187](https://github.com/Nick2bad4u/dnsValidator/blob/main/src/types.ts#L187)

Additional records (optional)

***

### answers

> **answers**: [`DNSRecord`](../type-aliases/DNSRecord.md)[]

Defined in: [types.ts:189](https://github.com/Nick2bad4u/dnsValidator/blob/main/src/types.ts#L189)

Answer records from the DNS response

***

### authority?

> `optional` **authority?**: [`DNSRecord`](../type-aliases/DNSRecord.md)[]

Defined in: [types.ts:191](https://github.com/Nick2bad4u/dnsValidator/blob/main/src/types.ts#L191)

Authority records (optional)

***

### question

> **question**: `object`

Defined in: [types.ts:193](https://github.com/Nick2bad4u/dnsValidator/blob/main/src/types.ts#L193)

The question section of the DNS query

#### class

> **class**: `string`

Query class (usually 'IN' for Internet)

#### name

> **name**: `string`

Domain name being queried

#### type

> **type**: [`DNSRecordType`](../type-aliases/DNSRecordType.md)

Type of record requested
