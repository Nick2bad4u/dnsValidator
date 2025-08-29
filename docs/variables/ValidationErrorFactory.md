# Variable: ValidationErrorFactory

> `const` **ValidationErrorFactory**: `object`

Defined in: [errors.ts:198](https://github.com/Nick2bad4u/dnsValidator/blob/main/src/errors.ts#L198)

Factory functions for creating validation errors with consistent messaging

## Type Declaration

### invalidIPAddress()

> `readonly` **invalidIPAddress**: (`address`, `version`) => [`InvalidFieldValueError`](../classes/InvalidFieldValueError.md)

#### Parameters

##### address

`string`

##### version

`4` | `6`

#### Returns

[`InvalidFieldValueError`](../classes/InvalidFieldValueError.md)

### invalidFQDN()

> `readonly` **invalidFQDN**: (`domain`) => [`InvalidFieldValueError`](../classes/InvalidFieldValueError.md)

#### Parameters

##### domain

`string`

#### Returns

[`InvalidFieldValueError`](../classes/InvalidFieldValueError.md)

### invalidPort()

> `readonly` **invalidPort**: (`port`) => [`InvalidFieldValueError`](../classes/InvalidFieldValueError.md)

#### Parameters

##### port

`number`

#### Returns

[`InvalidFieldValueError`](../classes/InvalidFieldValueError.md)

### invalidTTL()

> `readonly` **invalidTTL**: (`ttl`) => [`InvalidFieldValueError`](../classes/InvalidFieldValueError.md)

#### Parameters

##### ttl

`number`

#### Returns

[`InvalidFieldValueError`](../classes/InvalidFieldValueError.md)

### invalidPriority()

> `readonly` **invalidPriority**: (`priority`) => [`InvalidFieldValueError`](../classes/InvalidFieldValueError.md)

#### Parameters

##### priority

`number`

#### Returns

[`InvalidFieldValueError`](../classes/InvalidFieldValueError.md)

### invalidWeight()

> `readonly` **invalidWeight**: (`weight`) => [`InvalidFieldValueError`](../classes/InvalidFieldValueError.md)

#### Parameters

##### weight

`number`

#### Returns

[`InvalidFieldValueError`](../classes/InvalidFieldValueError.md)

### invalidEmail()

> `readonly` **invalidEmail**: (`email`) => [`InvalidFieldValueError`](../classes/InvalidFieldValueError.md)

#### Parameters

##### email

`string`

#### Returns

[`InvalidFieldValueError`](../classes/InvalidFieldValueError.md)

### invalidHexString()

> `readonly` **invalidHexString**: (`value`) => [`InvalidFieldValueError`](../classes/InvalidFieldValueError.md)

#### Parameters

##### value

`string`

#### Returns

[`InvalidFieldValueError`](../classes/InvalidFieldValueError.md)

### missingRequiredField()

> `readonly` **missingRequiredField**: (`field`, `recordType`) => [`MissingRequiredFieldError`](../classes/MissingRequiredFieldError.md)

#### Parameters

##### field

`string`

##### recordType

`string`

#### Returns

[`MissingRequiredFieldError`](../classes/MissingRequiredFieldError.md)

### malformedRecord()

> `readonly` **malformedRecord**: (`message`) => [`MalformedRecordError`](../classes/MalformedRecordError.md)

#### Parameters

##### message

`string`

#### Returns

[`MalformedRecordError`](../classes/MalformedRecordError.md)

### invalidRecordType()

> `readonly` **invalidRecordType**: (`type`) => [`InvalidRecordTypeError`](../classes/InvalidRecordTypeError.md)

#### Parameters

##### type

`unknown`

#### Returns

[`InvalidRecordTypeError`](../classes/InvalidRecordTypeError.md)
