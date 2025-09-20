[@ls-stack/utils](../modules.md) / partialEqual

# partialEqual

## Modules

- [\<internal\>](-internal-.md)

## Variables

### match

```ts
const match: Match;
```

Defined in: [packages/utils/src/partialEqual.ts:129](https://github.com/lucasols/utils/blob/main/packages/utils/src/partialEqual.ts#L129)

## Functions

### partialEqual()

#### Call Signature

```ts
function partialEqual(
   target, 
   sub, 
returnErrors): Result<void, PartialError[]>;
```

Defined in: [packages/utils/src/partialEqual.ts:1588](https://github.com/lucasols/utils/blob/main/packages/utils/src/partialEqual.ts#L1588)

Checks if sub is a partial match of target (all properties in sub exist and
match in target). Supports special comparison matchers for flexible pattern
matching.

##### Parameters

###### target

`any`

###### sub

`any`

###### returnErrors

`true`

##### Returns

`Result`\<`void`, [`PartialError`](-internal-.md#partialerror)[]\>

##### Example

```ts
// Basic partial matching
  partialEqual({ a: 1, b: 2 }, { a: 1 }); // true - sub is subset of target
  partialEqual([1, 2, 3], [1, 2]); // true - sub array is prefix of target (default behavior)

  // Array matching (default behavior: prefix matching)
  partialEqual([1, 2, 3, 4], [1, 2]); // true - checks first 2 elements
  partialEqual([1, 3, 4], [1, 2]); // false - second element doesn't match

  // Advanced array matchers for flexible matching
  partialEqual([1, 2, 3, 4, 5], match.array.contains([3, 1])); // true - contains elements anywhere
  partialEqual([1, 2, 3, 4, 5], match.array.containsInOrder([2, 4])); // true - contains in order (non-consecutive)
  partialEqual([1, 2, 3], match.array.startsWith([1, 2])); // true - explicit prefix matching
  partialEqual([1, 2, 3], match.array.endsWith([2, 3])); // true - suffix matching
  partialEqual([1, 2, 3], match.array.length(3)); // true - exact length
  partialEqual([1, 2, 3], match.array.includes(2)); // true - includes element
  partialEqual(
    [10, 20, 30],
    match.array.every(match.num.isGreaterThan(5)),
  ); // true - all elements match
  partialEqual([1, 10, 3], match.array.some(match.num.isGreaterThan(8))); // true - at least one matches

  // Special comparisons
  partialEqual('hello world', match.str.contains('world')); // true
  partialEqual(25, match.num.isGreaterThan(18)); // true
  partialEqual(
    'test@example.com',
    match.custom((v) => typeof v === 'string' && v.includes('@')),
  ); // true

  // Complex nested matching
  partialEqual(
    { user: { name: 'John', age: 30 } },
    {
      user: {
        name: match.str.startsWith('J'),
        age: match.num.isGreaterThan(25),
      },
    },
  ); // true
```

#### Call Signature

```ts
function partialEqual(target, sub): boolean;
```

Defined in: [packages/utils/src/partialEqual.ts:1593](https://github.com/lucasols/utils/blob/main/packages/utils/src/partialEqual.ts#L1593)

Checks if sub is a partial match of target (all properties in sub exist and
match in target). Supports special comparison matchers for flexible pattern
matching.

##### Parameters

###### target

`any`

###### sub

`any`

##### Returns

`boolean`

##### Example

```ts
// Basic partial matching
  partialEqual({ a: 1, b: 2 }, { a: 1 }); // true - sub is subset of target
  partialEqual([1, 2, 3], [1, 2]); // true - sub array is prefix of target (default behavior)

  // Array matching (default behavior: prefix matching)
  partialEqual([1, 2, 3, 4], [1, 2]); // true - checks first 2 elements
  partialEqual([1, 3, 4], [1, 2]); // false - second element doesn't match

  // Advanced array matchers for flexible matching
  partialEqual([1, 2, 3, 4, 5], match.array.contains([3, 1])); // true - contains elements anywhere
  partialEqual([1, 2, 3, 4, 5], match.array.containsInOrder([2, 4])); // true - contains in order (non-consecutive)
  partialEqual([1, 2, 3], match.array.startsWith([1, 2])); // true - explicit prefix matching
  partialEqual([1, 2, 3], match.array.endsWith([2, 3])); // true - suffix matching
  partialEqual([1, 2, 3], match.array.length(3)); // true - exact length
  partialEqual([1, 2, 3], match.array.includes(2)); // true - includes element
  partialEqual(
    [10, 20, 30],
    match.array.every(match.num.isGreaterThan(5)),
  ); // true - all elements match
  partialEqual([1, 10, 3], match.array.some(match.num.isGreaterThan(8))); // true - at least one matches

  // Special comparisons
  partialEqual('hello world', match.str.contains('world')); // true
  partialEqual(25, match.num.isGreaterThan(18)); // true
  partialEqual(
    'test@example.com',
    match.custom((v) => typeof v === 'string' && v.includes('@')),
  ); // true

  // Complex nested matching
  partialEqual(
    { user: { name: 'John', age: 30 } },
    {
      user: {
        name: match.str.startsWith('J'),
        age: match.num.isGreaterThan(25),
      },
    },
  ); // true
```
