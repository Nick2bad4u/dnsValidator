# Class: DNSValidationError

Defined in: [errors.ts:21](https://github.com/Nick2bad4u/dnsValidator/blob/main/src/errors.ts#L21)

Base class for all DNS validation errors.

## Extends

- `Error`

## Extended by

- [`InvalidFieldValueError`](InvalidFieldValueError.md)
- [`InvalidQueryStructureError`](InvalidQueryStructureError.md)
- [`InvalidRecordTypeError`](InvalidRecordTypeError.md)
- [`MalformedRecordError`](MalformedRecordError.md)
- [`MissingRequiredFieldError`](MissingRequiredFieldError.md)

## Constructors

### Constructor

> **new DNSValidationError**(`message`, `code`, `field?`, `value?`): `DNSValidationError`

Defined in: [errors.ts:26](https://github.com/Nick2bad4u/dnsValidator/blob/main/src/errors.ts#L26)

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

Defined in: [errors.ts:22](https://github.com/Nick2bad4u/dnsValidator/blob/main/src/errors.ts#L22)

***

### field

> `readonly` **field**: `string` \| `undefined`

Defined in: [errors.ts:23](https://github.com/Nick2bad4u/dnsValidator/blob/main/src/errors.ts#L23)

***

### value

> `readonly` **value**: `unknown`

Defined in: [errors.ts:24](https://github.com/Nick2bad4u/dnsValidator/blob/main/src/errors.ts#L24)
