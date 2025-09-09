[@ls-stack/utils](modules.md) / safeJson

# safeJson

## Functions

### safeJsonParse()

```ts
function safeJsonParse(value): unknown;
```

Defined in: [packages/utils/src/safeJson.ts:21](https://github.com/lucasols/utils/blob/main/packages/utils/src/safeJson.ts#L21)

JSON.parse can throw if the value is not valid JSON, this function catches
those errors and returns undefined

#### Parameters

##### value

`string`

#### Returns

`unknown`

***

### safeJsonStringify()

```ts
function safeJsonStringify(value): undefined | string;
```

Defined in: [packages/utils/src/safeJson.ts:7](https://github.com/lucasols/utils/blob/main/packages/utils/src/safeJson.ts#L7)

JSON.stringify can throw if the value is circular or contains functions, this
function catches those errors and returns undefined

#### Parameters

##### value

`unknown`

#### Returns

`undefined` \| `string`
