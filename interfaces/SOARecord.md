# Interface: SOARecord

Defined in: [src/types.ts:561](https://github.com/Nick2bad4u/dnsValidator/blob/main/src/types.ts#L561)

SOA record - Contains administrative information about a DNS zone.

## Example

```typescript
const record: SOARecord = {
  type: "SOA",
  primary: "ns1.example.com",
  admin: "admin.example.com",
  serial: 2023010101,
  refresh: 3600,
  retry: 1800,
  expiration: 604800,
  minimum: 86400,
  ttl: 86400,
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

<a id="admin"></a>

### admin? {#admin}

```ts
optional admin?: string;
```

Defined in: [src/types.ts:566](https://github.com/Nick2bad4u/dnsValidator/blob/main/src/types.ts#L566)

Administrator email (with the at sign replaced by .) (internal canonical
field, Node uses 'hostmaster')

---

<a id="expiration"></a>

### expiration? {#expiration}

```ts
optional expiration?: number;
```

Defined in: [src/types.ts:568](https://github.com/Nick2bad4u/dnsValidator/blob/main/src/types.ts#L568)

Expiration time in seconds (internal canonical field, Node uses 'expire')

---

<a id="expire"></a>

### expire? {#expire}

```ts
optional expire?: number;
```

Defined in: [src/types.ts:570](https://github.com/Nick2bad4u/dnsValidator/blob/main/src/types.ts#L570)

Node.js compatible expiration field

---

<a id="hostmaster"></a>

### hostmaster? {#hostmaster}

```ts
optional hostmaster?: string;
```

Defined in: [src/types.ts:572](https://github.com/Nick2bad4u/dnsValidator/blob/main/src/types.ts#L572)

Node.js compatible field name for administrator email

---

<a id="minimum"></a>

### minimum? {#minimum}

```ts
optional minimum?: number;
```

Defined in: [src/types.ts:577](https://github.com/Nick2bad4u/dnsValidator/blob/main/src/types.ts#L577)

Minimum TTL for negative caching (internal canonical field, Node uses
'minttl')

---

<a id="minttl"></a>

### minttl? {#minttl}

```ts
optional minttl?: number;
```

Defined in: [src/types.ts:579](https://github.com/Nick2bad4u/dnsValidator/blob/main/src/types.ts#L579)

Node.js compatible minimum TTL field

---

<a id="nsname"></a>

### nsname? {#nsname}

```ts
optional nsname?: string;
```

Defined in: [src/types.ts:581](https://github.com/Nick2bad4u/dnsValidator/blob/main/src/types.ts#L581)

Node.js compatible field name for primary name server

---

<a id="primary"></a>

### primary? {#primary}

```ts
optional primary?: string;
```

Defined in: [src/types.ts:586](https://github.com/Nick2bad4u/dnsValidator/blob/main/src/types.ts#L586)

Primary name server (internal canonical field, Node.js dns.resolveSoa
uses 'nsname')

---

<a id="refresh"></a>

### refresh {#refresh}

```ts
refresh: number;
```

Defined in: [src/types.ts:588](https://github.com/Nick2bad4u/dnsValidator/blob/main/src/types.ts#L588)

Refresh interval in seconds

---

<a id="retry"></a>

### retry {#retry}

```ts
retry: number;
```

Defined in: [src/types.ts:590](https://github.com/Nick2bad4u/dnsValidator/blob/main/src/types.ts#L590)

Retry interval in seconds

---

<a id="serial"></a>

### serial {#serial}

```ts
serial: number;
```

Defined in: [src/types.ts:592](https://github.com/Nick2bad4u/dnsValidator/blob/main/src/types.ts#L592)

Serial number for zone transfers

---

<a id="type"></a>

### type {#type}

```ts
type: "SOA";
```

Defined in: [src/types.ts:593](https://github.com/Nick2bad4u/dnsValidator/blob/main/src/types.ts#L593)

The type of DNS record

#### Overrides

[`BaseDNSRecord`](./BaseDNSRecord.md).[`type`](./BaseDNSRecord.md#type)
