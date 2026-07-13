# Function: calculateKeyTag()

```ts
function calculateKeyTag(dnskey: Readonly<DNSKEYRecord>): number;
```

Defined in: [src/dnssec.ts:183](https://github.com/Nick2bad4u/dnsValidator/blob/main/src/dnssec.ts#L183)

Calculates DNSKEY key tag (RFC 4034 Appendix B)

## Parameters

### dnskey

[`Readonly`](../type-aliases/Readonly.md)<[`DNSKEYRecord`](../interfaces/DNSKEYRecord.md)>

## Returns

`number`
