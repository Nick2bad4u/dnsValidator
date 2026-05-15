# Class: InvalidRecordTypeError

Defined in: [errors.ts:150](https://github.com/Nick2bad4u/dnsValidator/blob/main/src/errors.ts#L150)

Error thrown when a DNS record type is invalid or unsupported

## Extends

- [`DNSValidationError`](DNSValidationError.md)

## Constructors

### Constructor

> **new InvalidRecordTypeError**(`recordType`): `InvalidRecordTypeError`

Defined in: [errors.ts:151](https://github.com/Nick2bad4u/dnsValidator/blob/main/src/errors.ts#L151)

#### Parameters

##### recordType

`unknown`

#### Returns

`InvalidRecordTypeError`

#### Overrides

[`DNSValidationError`](DNSValidationError.md).[`constructor`](DNSValidationError.md#constructor)

## Properties

### code

> `readonly` **code**: `string`

Defined in: [errors.ts:22](https://github.com/Nick2bad4u/dnsValidator/blob/main/src/errors.ts#L22)

#### Inherited from

[`DNSValidationError`](DNSValidationError.md).[`code`](DNSValidationError.md#code)

***

### field

> `readonly` **field**: `string` \| `undefined`

Defined in: [errors.ts:23](https://github.com/Nick2bad4u/dnsValidator/blob/main/src/errors.ts#L23)

#### Inherited from

[`DNSValidationError`](DNSValidationError.md).[`field`](DNSValidationError.md#field)

***

### value

> `readonly` **value**: `unknown`

Defined in: [errors.ts:24](https://github.com/Nick2bad4u/dnsValidator/blob/main/src/errors.ts#L24)

#### Inherited from

[`DNSValidationError`](DNSValidationError.md).[`value`](DNSValidationError.md#value)
