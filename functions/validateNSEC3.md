# Function: validateNSEC3()

```ts
function validateNSEC3(record: unknown): NSEC3Record;
```

Defined in: [src/dnssec.ts:504](https://github.com/Nick2bad4u/dnsValidator/blob/main/src/dnssec.ts#L504)

Validates an NSEC3 record

## Parameters

### record

`unknown`

## Returns

[`NSEC3Record`](../interfaces/NSEC3Record.md)

## Throws

DNSValidationError When the NSEC3 record is invalid.
