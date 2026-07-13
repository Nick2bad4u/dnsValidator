# Interface: NSECRecord

Defined in: [src/types.ts:442](https://github.com/Nick2bad4u/dnsValidator/blob/main/src/types.ts#L442)

NSEC record - Next Secure, used for authenticated denial of existence in
DNSSEC.

## Example

```typescript
const record: NSECRecord = {
  type: "NSEC",
  nextDomainName: "b.example.com",
  typeBitmaps: "A NS SOA MX RRSIG NSEC DNSKEY",
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

<a id="nextdomainname"></a>

### nextDomainName {#nextdomainname}

```ts
nextDomainName: string;
```

Defined in: [src/types.ts:444](https://github.com/Nick2bad4u/dnsValidator/blob/main/src/types.ts#L444)

Next domain name in canonical ordering

---

<a id="type"></a>

### type {#type}

```ts
type: "NSEC";
```

Defined in: [src/types.ts:445](https://github.com/Nick2bad4u/dnsValidator/blob/main/src/types.ts#L445)

The type of DNS record

#### Overrides

[`BaseDNSRecord`](./BaseDNSRecord.md).[`type`](./BaseDNSRecord.md#type)

---

<a id="typebitmaps"></a>

### typeBitMaps {#typebitmaps}

```ts
typeBitMaps: string[];
```

Defined in: [src/types.ts:447](https://github.com/Nick2bad4u/dnsValidator/blob/main/src/types.ts#L447)

Array of record types that exist at this name

---

<a id="types"></a>

### ~~types?~~ {#types}

```ts
optional types?: string[];
```

Defined in: [src/types.ts:449](https://github.com/Nick2bad4u/dnsValidator/blob/main/src/types.ts#L449)

#### Deprecated

Use typeBitMaps instead
