# Interface: MXRecord

Defined in: [src/types.ts:309](https://github.com/Nick2bad4u/dnsValidator/blob/main/src/types.ts#L309)

MX record - Specifies mail exchange servers for a domain.

## Example

```typescript
const record: MXRecord = {
  type: "MX",
  priority: 10,
  exchange: "mail.example.com",
  ttl: 3600,
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

<a id="exchange"></a>

### exchange {#exchange}

```ts
exchange: string;
```

Defined in: [src/types.ts:311](https://github.com/Nick2bad4u/dnsValidator/blob/main/src/types.ts#L311)

Mail server hostname

---

<a id="priority"></a>

### priority {#priority}

```ts
priority: number;
```

Defined in: [src/types.ts:313](https://github.com/Nick2bad4u/dnsValidator/blob/main/src/types.ts#L313)

Priority value (0-65535, lower values have higher priority)

---

<a id="type"></a>

### type {#type}

```ts
type: "MX";
```

Defined in: [src/types.ts:314](https://github.com/Nick2bad4u/dnsValidator/blob/main/src/types.ts#L314)

The type of DNS record

#### Overrides

[`BaseDNSRecord`](./BaseDNSRecord.md).[`type`](./BaseDNSRecord.md#type)
