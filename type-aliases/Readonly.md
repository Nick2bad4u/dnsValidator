# Type Alias: Readonly\<T>

```ts
type Readonly<T> = { readonly [P in keyof T]: T[P] };
```

Defined in: node\_modules/typescript/lib/lib.es5.d.ts:1597

Make all properties in T readonly

## Type Parameters

### T

`T`
