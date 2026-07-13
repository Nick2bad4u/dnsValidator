# Interface: DNSQueryResult

Defined in: [src/types.ts:185](https://github.com/Nick2bad4u/dnsValidator/blob/main/src/types.ts#L185)

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

<a id="additional"></a>

### additional? {#additional}

```ts
optional additional?: DNSRecord[];
```

Defined in: [src/types.ts:187](https://github.com/Nick2bad4u/dnsValidator/blob/main/src/types.ts#L187)

Additional records (optional)

---

<a id="answers"></a>

### answers {#answers}

```ts
answers: DNSRecord[];
```

Defined in: [src/types.ts:189](https://github.com/Nick2bad4u/dnsValidator/blob/main/src/types.ts#L189)

Answer records from the DNS response

---

<a id="authority"></a>

### authority? {#authority}

```ts
optional authority?: DNSRecord[];
```

Defined in: [src/types.ts:191](https://github.com/Nick2bad4u/dnsValidator/blob/main/src/types.ts#L191)

Authority records (optional)

---

<a id="question"></a>

### question {#question}

```ts
question: {
  class: string;
  name: string;
  type: DNSRecordType;
};
```

Defined in: [src/types.ts:193](https://github.com/Nick2bad4u/dnsValidator/blob/main/src/types.ts#L193)

The question section of the DNS query

#### class

```ts
class: string;
```

Query class (usually 'IN' for Internet)

#### name

```ts
name: string;
```

Domain name being queried

#### type

```ts
type: DNSRecordType;
```

Type of record requested
