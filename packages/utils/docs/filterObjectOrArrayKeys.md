[**@ls-stack/utils**](README.md)

***

[@ls-stack/utils](modules.md) / filterObjectOrArrayKeys

# filterObjectOrArrayKeys

## Functions

### filterObjectOrArrayKeys()

```ts
function filterObjectOrArrayKeys(objOrArray, options): Record<string, any> | Record<string, any>[];
```

Defined in: [packages/utils/src/filterObjectOrArrayKeys.ts:38](https://github.com/lucasols/utils/blob/main/packages/utils/src/filterObjectOrArrayKeys.ts#L38)

Filters the keys of an object based on the provided patterns.

Filtering patterns in `rejectKeys` and `filterKeys`:
- `'prop'` - Only root-level properties named 'prop'
- `'**prop'` - Any property named exactly 'prop' at any level (root or nested)
- `'*.prop'` - Any nested property named 'prop' at second level (excludes root-level matches)
- `'test.*.prop'` - Any property named 'prop' at second level of 'test'
- `'test.*.test.**prop'` - Any property named 'prop' inside of 'test.*.test'
- `'prop.nested'` - Exact nested property paths like `obj.prop.nested`
- `'prop.**nested'` - All nested properties inside root `prop` with name `nested`
- `'prop[0]'` - The first item of the `prop` array
- `'prop[*]'` - All items of the `prop` array
- `'prop[0].nested'` - `nested` prop of the first item of the `prop` array
- `'prop[*].nested'` - `nested` prop of all items of the `prop` array
- `'prop[*]**nested'` - all `nested` props of all items of the `prop` array
- `'prop[0-2]'` - The first three items of the `prop` array
- `'prop[4-*]'` - All items of the `prop` array from the fourth index to the end
- `'prop[0-2].nested.**prop'` - Combining multiple nested patterns is supported
- Root array:
  - `'[0]'` - The first item of the root array
  - `'[*]'` - All items of the array
  - `'[0].nested'` - `nested` prop of the first item of the array
  - `'[*].nested'` - `nested` prop of all items of the array
  - `'[*]**nested'` - all `nested` props of all items of the array
  - `'[0-2]'` - The first three items of the array
  - `'[4-*]'` - All items of the array from the fourth index to the end

#### Parameters

##### objOrArray

The object or array to filter.

`Record`\<`string`, `any`\> | `Record`\<`string`, `any`\>[]

##### options

The options for the filter.

###### filterKeys?

`string` \| `string`[]

The keys to filter.

###### rejectEmptyObjectsInArray?

`boolean` = `true`

Whether to reject empty objects in arrays (default: true).

###### rejectKeys?

`string` \| `string`[]

The keys to reject.

#### Returns

`Record`\<`string`, `any`\> \| `Record`\<`string`, `any`\>[]

The filtered object or array.
