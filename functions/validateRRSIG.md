# Function: validateRRSIG()

```ts
function validateRRSIG(record: unknown): RRSIGRecord;
```

Defined in: [src/dnssec.ts:744](https://github.com/Nick2bad4u/dnsValidator/blob/main/src/dnssec.ts#L744)

Validates a RRSIG record

## Parameters

### record

`unknown`

## Returns

[`RRSIGRecord`](../interfaces/RRSIGRecord.md)

## Throws

DNSValidationError When the RRSIG record is invalid.
