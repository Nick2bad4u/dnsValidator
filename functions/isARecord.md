# Function: isARecord()

> **isARecord**(`record`): `record is ARecord`

Defined in: [validators.ts:88](https://github.com/Nick2bad4u/dnsValidator/blob/main/src/validators.ts#L88)

Validates an A record (IPv4 address mapping).

Checks that the record has the correct type, a valid IPv4 address,
and an optional valid TTL value.

## Parameters

### record

`unknown`

The record to validate

## Returns

`record is ARecord`

True if the record is a valid A record

## Example

```typescript
const record = { type: 'A', address: '192.168.1.1', ttl: 300 };
console.log(isARecord(record)); // true

const invalid = { type: 'A', address: '999.999.999.999' };
console.log(isARecord(invalid)); // false
```
