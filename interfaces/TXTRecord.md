# Interface: TXTRecord

Defined in: [src/types.ts:714](https://github.com/Nick2bad4u/dnsValidator/blob/main/src/types.ts#L714)

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

- [`BaseDNSRecord`](./BaseDNSRecord.md)

## Properties

<a id="ttl"></a>

### ttl? {#ttl}

```ts
optional ttl?: number;
```

Defined in: [src/types.ts:76](https://github.com/Nick2bad4u/dnsValidator/blob/main/src/types.ts#L76)

Time to live in seconds (optional)

#### Inherited from

[`BaseDNSRecord`](./BaseDNSRecord.md).[`ttl`](./BaseDNSRecord.md#ttl)

---

<a id="entries"></a>

### entries {#entries}

```ts
entries: string[];
```

Defined in: [src/types.ts:716](https://github.com/Nick2bad4u/dnsValidator/blob/main/src/types.ts#L716)

Array of text strings

---

<a id="type"></a>

### type {#type}

```ts
type: "TXT";
```

Defined in: [src/types.ts:717](https://github.com/Nick2bad4u/dnsValidator/blob/main/src/types.ts#L717)

The type of DNS record

#### Overrides

[`BaseDNSRecord`](./BaseDNSRecord.md).[`type`](./BaseDNSRecord.md#type)
