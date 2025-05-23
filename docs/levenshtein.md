[**@ls-stack/utils**](README.md)

***

[@ls-stack/utils](modules.md) / levenshtein

# levenshtein

## Functions

### getClosestString()

```ts
function getClosestString(
   str, 
   arr, 
   maxDistance): undefined | string;
```

Defined in: [src/levenshtein.ts:134](https://github.com/lucasols/utils/blob/main/src/levenshtein.ts#L134)

#### Parameters

##### str

`string`

##### arr

readonly `string`[]

##### maxDistance

`number` = `2`

#### Returns

`undefined` \| `string`

***

### getClosestStringsUpToDist()

```ts
function getClosestStringsUpToDist(
   str, 
   arr, 
   maxDistance): string[];
```

Defined in: [src/levenshtein.ts:151](https://github.com/lucasols/utils/blob/main/src/levenshtein.ts#L151)

#### Parameters

##### str

`string`

##### arr

readonly `string`[]

##### maxDistance

`number` = `2`

#### Returns

`string`[]

***

### levenshteinDistance()

```ts
function levenshteinDistance(a, b): number;
```

Defined in: [src/levenshtein.ts:119](https://github.com/lucasols/utils/blob/main/src/levenshtein.ts#L119)

#### Parameters

##### a

`string`

##### b

`string`

#### Returns

`number`
