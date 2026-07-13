# Type Alias: ValueOf\<ObjectType, ValueType>

```ts
type ValueOf<ObjectType, ValueType> = ObjectType[ValueType];
```

Defined in: node\_modules/type-fest/source/value-of.d.ts:22

Create a union of the given object's values, and optionally specify which keys to get the values from.

Please upvote [this issue](https://github.com/microsoft/TypeScript/issues/31438) if you want to have this type as a built-in in TypeScript.

## Type Parameters

### ObjectType

`ObjectType`

### ValueType

`ValueType` _extends_ keyof `ObjectType` = keyof `ObjectType`

## Example

```
import type {ValueOf} from 'type-fest';

type A = ValueOf<{id: number; name: string; active: boolean}>;
//=> string | number | boolean

type B = ValueOf<{id: number; name: string; active: boolean}, 'name'>;
//=> string

type C = ValueOf<{id: number; name: string; active: boolean}, 'id' | 'name'>;
//=> string | number
```
