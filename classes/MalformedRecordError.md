# Class: MalformedRecordError

Defined in: [errors.ts:165](https://github.com/Nick2bad4u/dnsValidator/blob/main/src/errors.ts#L165)

Error thrown when a DNS record structure is malformed

## Extends

- [`DNSValidationError`](DNSValidationError.md)

## Constructors

### Constructor

> **new MalformedRecordError**(`message`, `field?`, `value?`): `MalformedRecordError`

Defined in: [errors.ts:166](https://github.com/Nick2bad4u/dnsValidator/blob/main/src/errors.ts#L166)

#### Parameters

##### message

`string`

##### field?

`string`

##### value?

`unknown`

#### Returns

`MalformedRecordError`

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
