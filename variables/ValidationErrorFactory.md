# Variable: ValidationErrorFactory

```ts
const ValidationErrorFactory: {
  invalidEmail: (email: string) => InvalidFieldValueError;
  invalidFQDN: (domain: string) => InvalidFieldValueError;
  invalidHexString: (value: string) => InvalidFieldValueError;
  invalidIPAddress: (address: string, version: 4 | 6) => InvalidFieldValueError;
  invalidPort: (port: number) => InvalidFieldValueError;
  invalidPriority: (priority: number) => InvalidFieldValueError;
  invalidRecordType: (type: unknown) => InvalidRecordTypeError;
  invalidTTL: (ttl: number) => InvalidFieldValueError;
  invalidWeight: (weight: number) => InvalidFieldValueError;
  malformedRecord: (message: string) => MalformedRecordError;
  missingRequiredField: (
    field: string,
    recordType: string,
  ) => MissingRequiredFieldError;
};
```

Defined in: [src/errors.ts:251](https://github.com/Nick2bad4u/dnsValidator/blob/main/src/errors.ts#L251)

Factory functions for creating validation errors with consistent messaging

## Type Declaration

<a id="invalidemail"></a>

### invalidEmail {#invalidemail}

```ts
readonly invalidEmail: (email: string) => InvalidFieldValueError;
```

#### Parameters

##### email

`string`

#### Returns

[`InvalidFieldValueError`](../classes/InvalidFieldValueError.md)

<a id="invalidfqdn"></a>

### invalidFQDN {#invalidfqdn}

```ts
readonly invalidFQDN: (domain: string) => InvalidFieldValueError;
```

#### Parameters

##### domain

`string`

#### Returns

[`InvalidFieldValueError`](../classes/InvalidFieldValueError.md)

<a id="invalidhexstring"></a>

### invalidHexString {#invalidhexstring}

```ts
readonly invalidHexString: (value: string) => InvalidFieldValueError;
```

#### Parameters

##### value

`string`

#### Returns

[`InvalidFieldValueError`](../classes/InvalidFieldValueError.md)

<a id="invalidipaddress"></a>

### invalidIPAddress {#invalidipaddress}

```ts
readonly invalidIPAddress: (address: string, version: 4 | 6) => InvalidFieldValueError;
```

#### Parameters

##### address

`string`

##### version

`4` | `6`

#### Returns

[`InvalidFieldValueError`](../classes/InvalidFieldValueError.md)

<a id="invalidport"></a>

### invalidPort {#invalidport}

```ts
readonly invalidPort: (port: number) => InvalidFieldValueError;
```

#### Parameters

##### port

`number`

#### Returns

[`InvalidFieldValueError`](../classes/InvalidFieldValueError.md)

<a id="invalidpriority"></a>

### invalidPriority {#invalidpriority}

```ts
readonly invalidPriority: (priority: number) => InvalidFieldValueError;
```

#### Parameters

##### priority

`number`

#### Returns

[`InvalidFieldValueError`](../classes/InvalidFieldValueError.md)

<a id="invalidrecordtype"></a>

### invalidRecordType {#invalidrecordtype}

```ts
readonly invalidRecordType: (type: unknown) => InvalidRecordTypeError;
```

#### Parameters

##### type

`unknown`

#### Returns

[`InvalidRecordTypeError`](../classes/InvalidRecordTypeError.md)

<a id="invalidttl"></a>

### invalidTTL {#invalidttl}

```ts
readonly invalidTTL: (ttl: number) => InvalidFieldValueError;
```

#### Parameters

##### ttl

`number`

#### Returns

[`InvalidFieldValueError`](../classes/InvalidFieldValueError.md)

<a id="invalidweight"></a>

### invalidWeight {#invalidweight}

```ts
readonly invalidWeight: (weight: number) => InvalidFieldValueError;
```

#### Parameters

##### weight

`number`

#### Returns

[`InvalidFieldValueError`](../classes/InvalidFieldValueError.md)

<a id="malformedrecord"></a>

### malformedRecord {#malformedrecord}

```ts
readonly malformedRecord: (message: string) => MalformedRecordError;
```

#### Parameters

##### message

`string`

#### Returns

[`MalformedRecordError`](../classes/MalformedRecordError.md)

<a id="missingrequiredfield"></a>

### missingRequiredField {#missingrequiredfield}

```ts
readonly missingRequiredField: (field: string, recordType: string) => MissingRequiredFieldError;
```

#### Parameters

##### field

`string`

##### recordType

`string`

#### Returns

[`MissingRequiredFieldError`](../classes/MissingRequiredFieldError.md)
