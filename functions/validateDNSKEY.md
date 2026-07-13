# Function: validateDNSKEY()

```ts
function validateDNSKEY(record: unknown): DNSKEYRecord;
```

Defined in: [src/dnssec.ts:232](https://github.com/Nick2bad4u/dnsValidator/blob/main/src/dnssec.ts#L232)

Validates a DNSKEY record

## Parameters

### record

`unknown`

## Returns

[`DNSKEYRecord`](../interfaces/DNSKEYRecord.md)

## Throws

DNSValidationError When the DNSKEY record is invalid.
