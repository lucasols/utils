[@ls-stack/react-utils](modules.md) / usePrevious

# usePrevious

## Functions

### usePrevious()

#### Call Signature

```ts
function usePrevious<T>(value): T | undefined;
```

Defined in: [react-utils/src/usePrevious.ts:3](https://github.com/lucasols/utils/blob/main/packages/react-utils/src/usePrevious.ts#L3)

##### Type Parameters

###### T

`T`

##### Parameters

###### value

`T`

##### Returns

`T` \| `undefined`

#### Call Signature

```ts
function usePrevious<T>(value, initial): T;
```

Defined in: [react-utils/src/usePrevious.ts:4](https://github.com/lucasols/utils/blob/main/packages/react-utils/src/usePrevious.ts#L4)

##### Type Parameters

###### T

`T`

##### Parameters

###### value

`T`

###### initial

`T`

##### Returns

`T`

***

### usePreviousChanged()

```ts
function usePreviousChanged<T, I>(
   value, 
   initialValue, 
   equalityFn): T | I;
```

Defined in: [react-utils/src/usePrevious.ts:13](https://github.com/lucasols/utils/blob/main/packages/react-utils/src/usePrevious.ts#L13)

#### Type Parameters

##### T

`T`

##### I

`I` = `T`

#### Parameters

##### value

`T`

##### initialValue

`I` = `...`

##### equalityFn

(`value1`, `value2`) => `boolean`

#### Returns

`T` \| `I`
