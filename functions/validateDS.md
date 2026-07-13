# Function: validateDS()

```ts
function validateDS(record: unknown): DSRecord;
```

Defined in: [src/dnssec.ts:302](https://github.com/Nick2bad4u/dnsValidator/blob/main/src/dnssec.ts#L302)

Validates a DS record

## Parameters

### record

`unknown`

## Returns

[`DSRecord`](../interfaces/DSRecord.md)

## Throws

DNSValidationError When the DS record is invalid.
