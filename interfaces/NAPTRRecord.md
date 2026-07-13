# Interface: NAPTRRecord

Defined in: [src/types.ts:340](https://github.com/Nick2bad4u/dnsValidator/blob/main/src/types.ts#L340)

NAPTR record - Naming Authority Pointer.

Used for mapping services to domain names, often in ENUM and SIP
applications.

## Example

```typescript
const record: NAPTRRecord = {
  type: "NAPTR",
  order: 100,
  preference: 50,
  flags: "u",
  service: "E2U+sip",
  regexp: "!^.*$!sip:info@example.com!",
  replacement: "",
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

<a id="flags"></a>

### flags {#flags}

```ts
flags: string;
```

Defined in: [src/types.ts:342](https://github.com/Nick2bad4u/dnsValidator/blob/main/src/types.ts#L342)

Flags controlling processing

---

<a id="order"></a>

### order {#order}

```ts
order: number;
```

Defined in: [src/types.ts:344](https://github.com/Nick2bad4u/dnsValidator/blob/main/src/types.ts#L344)

Order value for processing sequence

---

<a id="preference"></a>

### preference {#preference}

```ts
preference: number;
```

Defined in: [src/types.ts:346](https://github.com/Nick2bad4u/dnsValidator/blob/main/src/types.ts#L346)

Preference value within same order

---

<a id="regexp"></a>

### regexp {#regexp}

```ts
regexp: string;
```

Defined in: [src/types.ts:348](https://github.com/Nick2bad4u/dnsValidator/blob/main/src/types.ts#L348)

Regular expression for URI construction

---

<a id="replacement"></a>

### replacement {#replacement}

```ts
replacement: string;
```

Defined in: [src/types.ts:350](https://github.com/Nick2bad4u/dnsValidator/blob/main/src/types.ts#L350)

Replacement domain name

---

<a id="service"></a>

### service {#service}

```ts
service: string;
```

Defined in: [src/types.ts:352](https://github.com/Nick2bad4u/dnsValidator/blob/main/src/types.ts#L352)

Service parameters

---

<a id="type"></a>

### type {#type}

```ts
type: "NAPTR";
```

Defined in: [src/types.ts:353](https://github.com/Nick2bad4u/dnsValidator/blob/main/src/types.ts#L353)

The type of DNS record

#### Overrides

[`BaseDNSRecord`](./BaseDNSRecord.md).[`type`](./BaseDNSRecord.md#type)
