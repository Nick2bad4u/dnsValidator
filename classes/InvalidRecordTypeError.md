# Class: InvalidRecordTypeError

Defined in: [errors.ts:74](https://github.com/Nick2bad4u/dnsValidator/blob/main/src/errors.ts#L74)

Error thrown when a DNS record type is invalid or unsupported

## Extends

- [`DNSValidationError`](DNSValidationError.md)

## Constructors

### Constructor

> **new InvalidRecordTypeError**(`recordType`): `InvalidRecordTypeError`

Defined in: [errors.ts:75](https://github.com/Nick2bad4u/dnsValidator/blob/main/src/errors.ts#L75)

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

Defined in: [errors.ts:9](https://github.com/Nick2bad4u/dnsValidator/blob/main/src/errors.ts#L9)

#### Inherited from

[`DNSValidationError`](DNSValidationError.md).[`code`](DNSValidationError.md#code)

***

### field

> `readonly` **field**: `undefined` \| `string`

Defined in: [errors.ts:10](https://github.com/Nick2bad4u/dnsValidator/blob/main/src/errors.ts#L10)

#### Inherited from

[`DNSValidationError`](DNSValidationError.md).[`field`](DNSValidationError.md#field)

***

### value

> `readonly` **value**: `unknown`

Defined in: [errors.ts:11](https://github.com/Nick2bad4u/dnsValidator/blob/main/src/errors.ts#L11)

#### Inherited from

[`DNSValidationError`](DNSValidationError.md).[`value`](DNSValidationError.md#value)
