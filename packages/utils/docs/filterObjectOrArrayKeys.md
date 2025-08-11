[**@ls-stack/utils**](README.md)

***

[@ls-stack/utils](modules.md) / filterObjectOrArrayKeys

# filterObjectOrArrayKeys

## Functions

### filterObjectOrArrayKeys()

```ts
function filterObjectOrArrayKeys(objOrArray, options): Record<string, any> | Record<string, any>[];
```

Defined in: [packages/utils/src/filterObjectOrArrayKeys.ts:60](https://github.com/lucasols/utils/blob/main/packages/utils/src/filterObjectOrArrayKeys.ts#L60)

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
- Pattern expansion with parentheses:
  - `'prop.test.(prop1|prop2|prop3)'` - Expands to `prop.test.prop1`, `prop.test.prop2`, and `prop.test.prop3`
  - `'components[*].(table_id|columns|filters[*].value)'` - Expands to `components[*].table_id`, `components[*].columns`, and `components[*].filters[*].value`
  - `'(users|admins)[*].name'` - Expands to `users[*].name` and `admins[*].name`
- Array filtering by value:
  - `'users[%name="John"]'` - Filters the `users` with the `name` property equal to `John`
  - `'users[%name="John" | "Jane"]'` - Value-level OR using `|` for multiple values of same property
  - `'users[%name="Alice" || %age=35]'` - Property-level OR using `||` for different properties
  - `'users[%age=30 && %role="admin"]'` - Property-level AND using `&&` for different properties
  - Note: Mixing `&&` and `||` in the same filter is not supported - use separate filter patterns instead
  - `'users[%config.name="John" | "Jane"]'` - Dot notation is supported
  - `'users[%name*="oh"]'` - Contains operator (*=) - filters users where name contains "oh"
  - `'users[%name^="Jo"]'` - Starts with operator (^=) - filters users where name starts with "Jo"
  - `'users[%name$="hn"]'` - Ends with operator ($=) - filters users where name ends with "hn"
  - `'users[%name!="John"]'` - Not equal operator (!=) - filters users where name is not "John"
  - `'users[%name!*="admin"]'` - Not contains operator (!*=) - filters users where name doesn't contain "admin"
  - `'users[i%name="john"]'` - Case-insensitive matching (i% prefix) - matches "John", "JOHN", "john", etc.

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

###### sortKeys?

`false` \| `"asc"` \| `"simpleValuesFirst"` \| `"desc"` = `'simpleValuesFirst'`

Sort all keys by a specific order (optional, preserves original order when not specified).

###### sortPatterns?

`string`[]

Sort specific keys by pattern. Use to control the order of specific properties. The same patterns as `filterKeys` are supported.

#### Returns

`Record`\<`string`, `any`\> \| `Record`\<`string`, `any`\>[]

The filtered object or array.
