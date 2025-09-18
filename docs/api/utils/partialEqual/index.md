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

Defined in: [packages/utils/src/partialEqual.ts:1063](https://github.com/lucasols/utils/blob/main/packages/utils/src/partialEqual.ts#L1063)

##### Parameters

###### target

`any`

###### sub

`any`

###### returnErrors

`true`

##### Returns

`Result`\<`void`, [`PartialError`](-internal-.md#partialerror)[]\>

#### Call Signature

```ts
function partialEqual(target, sub): boolean;
```

Defined in: [packages/utils/src/partialEqual.ts:1068](https://github.com/lucasols/utils/blob/main/packages/utils/src/partialEqual.ts#L1068)

##### Parameters

###### target

`any`

###### sub

`any`

##### Returns

`boolean`
