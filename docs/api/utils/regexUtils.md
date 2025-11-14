[@ls-stack/utils](modules.md) / regexUtils

# regexUtils

## Functions

### escapeRegExp()

```ts
function escapeRegExp(value): string;
```

Defined in: [packages/utils/src/regexUtils.ts:32](https://github.com/lucasols/utils/blob/main/packages/utils/src/regexUtils.ts#L32)

#### Parameters

##### value

`string`

#### Returns

`string`

***

### getRegexMatchAll()

```ts
function getRegexMatchAll(str, regexp): Generator<{
  end: number;
  fullMatch: string;
  groups: (undefined | string)[];
  namedGroups:   | undefined
     | {
   [key: string]: string;
   };
  prevEnd: number;
  start: number;
}, void, unknown>;
```

Defined in: [packages/utils/src/regexUtils.ts:7](https://github.com/lucasols/utils/blob/main/packages/utils/src/regexUtils.ts#L7)

#### Parameters

##### str

`string`

##### regexp

`RegExp`

#### Returns

`Generator`\<\{
  `end`: `number`;
  `fullMatch`: `string`;
  `groups`: (`undefined` \| `string`)[];
  `namedGroups`:   \| `undefined`
     \| \{
   [`key`: `string`]: `string`;
   \};
  `prevEnd`: `number`;
  `start`: `number`;
\}, `void`, `unknown`\>

***

### getRegexMatches()

```ts
function getRegexMatches(string, regex): object;
```

Defined in: [packages/utils/src/regexUtils.ts:1](https://github.com/lucasols/utils/blob/main/packages/utils/src/regexUtils.ts#L1)

#### Parameters

##### string

`string`

##### regex

`RegExp`

#### Returns

`object`

##### fullMatch

```ts
fullMatch: undefined | string;
```

##### groups

```ts
groups: (undefined | string)[];
```
