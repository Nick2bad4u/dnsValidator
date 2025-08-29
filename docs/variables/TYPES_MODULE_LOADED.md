# Variable: TYPES\_MODULE\_LOADED

> `const` **TYPES\_MODULE\_LOADED**: `true` = `true`

Defined in: [types.ts:748](https://github.com/Nick2bad4u/dnsValidator/blob/main/src/types.ts#L748)

**`Internal`**

Runtime constant exported to ensure this module registers executable code for coverage tools.
This has no functional impact on consumers but allows statement coverage to reflect that the
types module was loaded at runtime (imports that only use types are erased from emitted JS).
