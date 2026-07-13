# Interface: SRVRecord

Defined in: [src/types.ts:614](https://github.com/Nick2bad4u/dnsValidator/blob/main/src/types.ts#L614)

SRV record - Specifies the location of services within a domain.

## Example

```typescript
const record: SRVRecord = {
  type: "SRV",
  priority: 10,
  weight: 5,
  port: 443,
  name: "server.example.com",
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

<a id="name"></a>

### name {#name}

```ts
name: string;
```

Defined in: [src/types.ts:616](https://github.com/Nick2bad4u/dnsValidator/blob/main/src/types.ts#L616)

Hostname of the target

---

<a id="port"></a>

### port {#port}

```ts
port: number;
```

Defined in: [src/types.ts:618](https://github.com/Nick2bad4u/dnsValidator/blob/main/src/types.ts#L618)

Port number of the service

---

<a id="priority"></a>

### priority {#priority}

```ts
priority: number;
```

Defined in: [src/types.ts:620](https://github.com/Nick2bad4u/dnsValidator/blob/main/src/types.ts#L620)

Priority of the target host (0-65535, lower values preferred)

---

<a id="type"></a>

### type {#type}

```ts
type: "SRV";
```

Defined in: [src/types.ts:621](https://github.com/Nick2bad4u/dnsValidator/blob/main/src/types.ts#L621)

The type of DNS record

#### Overrides

[`BaseDNSRecord`](./BaseDNSRecord.md).[`type`](./BaseDNSRecord.md#type)

---

<a id="weight"></a>

### weight {#weight}

```ts
weight: number;
```

Defined in: [src/types.ts:623](https://github.com/Nick2bad4u/dnsValidator/blob/main/src/types.ts#L623)

Weight for load balancing among hosts with same priority
