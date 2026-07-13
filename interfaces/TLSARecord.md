# Interface: TLSARecord

Defined in: [src/types.ts:675](https://github.com/Nick2bad4u/dnsValidator/blob/main/src/types.ts#L675)

TLSA record - DNS-based Authentication of Named Entities (DANE).

Associates a TLS server certificate with the domain name where the record is
found.

## Example

```typescript
const record: TLSARecord = {
  type: "TLSA",
  usage: 3,
  selector: 1,
  matchingType: 1,
  certificate: "abcdef1234567890...",
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

<a id="certificate"></a>

### certificate? {#certificate}

```ts
optional certificate?: string;
```

Defined in: [src/types.ts:680](https://github.com/Nick2bad4u/dnsValidator/blob/main/src/types.ts#L680)

Certificate association data internal canonical (Node uses 'data' as
ArrayBuffer/Buffer)

---

<a id="certusage"></a>

### certUsage? {#certusage}

```ts
optional certUsage?: number;
```

Defined in: [src/types.ts:682](https://github.com/Nick2bad4u/dnsValidator/blob/main/src/types.ts#L682)

Node.js compatible certificate usage

---

<a id="data"></a>

### data? {#data}

```ts
optional data?:
  | string
  | ArrayBuffer
  | Uint8Array<ArrayBufferLike>;
```

Defined in: [src/types.ts:684](https://github.com/Nick2bad4u/dnsValidator/blob/main/src/types.ts#L684)

Node.js compatible data (hex/base64 string or Buffer)

---

<a id="match"></a>

### match? {#match}

```ts
optional match?: number;
```

Defined in: [src/types.ts:689](https://github.com/Nick2bad4u/dnsValidator/blob/main/src/types.ts#L689)

Node.js compatible matching type

---

<a id="matchingtype"></a>

### matchingType? {#matchingtype}

```ts
optional matchingType?: number;
```

Defined in: [src/types.ts:691](https://github.com/Nick2bad4u/dnsValidator/blob/main/src/types.ts#L691)

Matching type (0-2) internal canonical (Node uses 'match')

---

<a id="selector"></a>

### selector {#selector}

```ts
selector: number;
```

Defined in: [src/types.ts:693](https://github.com/Nick2bad4u/dnsValidator/blob/main/src/types.ts#L693)

Selector (0-1)

---

<a id="type"></a>

### type {#type}

```ts
type: "TLSA";
```

Defined in: [src/types.ts:694](https://github.com/Nick2bad4u/dnsValidator/blob/main/src/types.ts#L694)

The type of DNS record

#### Overrides

[`BaseDNSRecord`](./BaseDNSRecord.md).[`type`](./BaseDNSRecord.md#type)

---

<a id="usage"></a>

### usage? {#usage}

```ts
optional usage?: number;
```

Defined in: [src/types.ts:696](https://github.com/Nick2bad4u/dnsValidator/blob/main/src/types.ts#L696)

Certificate usage (0-3) internal canonical (Node uses 'certUsage')
