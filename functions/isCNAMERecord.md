# Function: isCNAMERecord()

> **isCNAMERecord**(`record`): `record is CNAMERecord`

Defined in: [validators.ts:158](https://github.com/Nick2bad4u/dnsValidator/blob/main/src/validators.ts#L158)

Validates a CNAME record (canonical name alias).

Checks that the record has the correct type, a valid fully qualified domain name,
and an optional valid TTL value.

## Parameters

### record

`unknown`

The record to validate

## Returns

`record is CNAMERecord`

True if the record is a valid CNAME record

## Example

```typescript
const record = { type: 'CNAME', value: 'canonical.example.com', ttl: 300 };
console.log(isCNAMERecord(record)); // true

const invalid = { type: 'CNAME', value: 'not-a-domain' };
console.log(isCNAMERecord(invalid)); // false
```
