# Function: isAAAARecord()

> **isAAAARecord**(`record`): `record is AAAARecord`

Defined in: [validators.ts:123](https://github.com/Nick2bad4u/dnsValidator/blob/main/src/validators.ts#L123)

Validates an AAAA record (IPv6 address mapping).

Checks that the record has the correct type, a valid IPv6 address,
and an optional valid TTL value.

## Parameters

### record

`unknown`

The record to validate

## Returns

`record is AAAARecord`

True if the record is a valid AAAA record

## Example

```typescript
const record = { type: 'AAAA', address: '2001:db8::1', ttl: 300 };
console.log(isAAAARecord(record)); // true

const invalid = { type: 'AAAA', address: '192.168.1.1' };
console.log(isAAAARecord(invalid)); // false
```
