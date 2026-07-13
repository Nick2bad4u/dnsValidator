# Function: isDNSRecord()

```ts
function isDNSRecord(record: unknown): record is DNSRecord;
```

Defined in: [src/validators.ts:547](https://github.com/Nick2bad4u/dnsValidator/blob/main/src/validators.ts#L547)

Validates any supported DNS record by dispatching to its specific validator.

## Parameters

### record

`unknown`

## Returns

`record is DNSRecord`
