# Function: validateNSEC3PARAM()

```ts
function validateNSEC3PARAM(record: unknown): NSEC3PARAMRecord;
```

Defined in: [src/dnssec.ts:676](https://github.com/Nick2bad4u/dnsValidator/blob/main/src/dnssec.ts#L676)

Validates an NSEC3PARAM record

## Parameters

### record

`unknown`

## Returns

[`NSEC3PARAMRecord`](../interfaces/NSEC3PARAMRecord.md)

## Throws

DNSValidationError When the NSEC3PARAM record is invalid.
