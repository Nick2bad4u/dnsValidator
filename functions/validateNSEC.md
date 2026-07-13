# Function: validateNSEC()

```ts
function validateNSEC(record: unknown): NSECRecord;
```

Defined in: [src/dnssec.ts:380](https://github.com/Nick2bad4u/dnsValidator/blob/main/src/dnssec.ts#L380)

Validates an NSEC record

## Parameters

### record

`unknown`

## Returns

[`NSECRecord`](../interfaces/NSECRecord.md)

## Throws

DNSValidationError When the NSEC record is invalid.
