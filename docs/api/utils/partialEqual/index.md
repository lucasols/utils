[@ls-stack/utils](../modules.md) / partialEqual

# partialEqual

## Modules

- [\<internal\>](-internal-.md)

## Variables

### match

```ts
const match: Match;
```

Defined in: [packages/utils/src/partialEqual.ts:86](https://github.com/lucasols/utils/blob/main/packages/utils/src/partialEqual.ts#L86)

## Functions

### partialEqual()

#### Call Signature

```ts
function partialEqual(
   target, 
   sub, 
returnErrors): Result<void, PartialError[]>;
```

Defined in: [packages/utils/src/partialEqual.ts:1011](https://github.com/lucasols/utils/blob/main/packages/utils/src/partialEqual.ts#L1011)

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
  partialEqual([1, 2, 3], [1, 2]); // true - sub array is prefix of target

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

Defined in: [packages/utils/src/partialEqual.ts:1016](https://github.com/lucasols/utils/blob/main/packages/utils/src/partialEqual.ts#L1016)

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
  partialEqual([1, 2, 3], [1, 2]); // true - sub array is prefix of target

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
