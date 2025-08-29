# Class: DNSValidationError

Defined in: [errors.ts:8](https://github.com/Nick2bad4u/dnsValidator/blob/main/src/errors.ts#L8)

Base class for all DNS validation errors

## Extends

- `Error`

## Extended by

- [`InvalidRecordTypeError`](InvalidRecordTypeError.md)
- [`MalformedRecordError`](MalformedRecordError.md)
- [`InvalidFieldValueError`](InvalidFieldValueError.md)
- [`MissingRequiredFieldError`](MissingRequiredFieldError.md)
- [`InvalidQueryStructureError`](InvalidQueryStructureError.md)

## Constructors

### Constructor

> **new DNSValidationError**(`message`, `code`, `field?`, `value?`): `DNSValidationError`

Defined in: [errors.ts:13](https://github.com/Nick2bad4u/dnsValidator/blob/main/src/errors.ts#L13)

#### Parameters

##### message

`string`

##### code

`string`

##### field?

`string`

##### value?

`unknown`

#### Returns

`DNSValidationError`

#### Overrides

`Error.constructor`

## Properties

### code

> `readonly` **code**: `string`

Defined in: [errors.ts:9](https://github.com/Nick2bad4u/dnsValidator/blob/main/src/errors.ts#L9)

***

### field

> `readonly` **field**: `undefined` \| `string`

Defined in: [errors.ts:10](https://github.com/Nick2bad4u/dnsValidator/blob/main/src/errors.ts#L10)

***

### value

> `readonly` **value**: `unknown`

Defined in: [errors.ts:11](https://github.com/Nick2bad4u/dnsValidator/blob/main/src/errors.ts#L11)
