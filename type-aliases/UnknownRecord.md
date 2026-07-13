# Type Alias: UnknownRecord

```ts
type UnknownRecord = Record<PropertyKey, unknown>;
```

Defined in: node\_modules/type-fest/source/unknown-record.d.ts:31

Represents an object with `unknown` value. You probably want this instead of `{}`.

Use case: You have an object whose keys and values are unknown to you.

## Example

```
import type {UnknownRecord} from 'type-fest';

function toJson(object: UnknownRecord) {
	return JSON.stringify(object);
}

toJson({hello: 'world'}); // Ok

function isObject(value: unknown): value is UnknownRecord {
	return typeof value === 'object' && value !== null;
}

const value: unknown = {hello: 'world'};

if (isObject(value)) {
	const v = value;
	//=> UnknownRecord
}
```
