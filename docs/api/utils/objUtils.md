[@ls-stack/utils](modules.md) / objUtils

# objUtils

## Variables

### ~~mapArrayToObject()~~

```ts
const mapArrayToObject: <T, K, O>(array, mapper) => Record<K, O> = mapArrToObj;
```

Defined in: [packages/utils/src/objUtils.ts:35](https://github.com/lucasols/utils/blob/main/packages/utils/src/objUtils.ts#L35)

#### Type Parameters

##### T

`T`

##### K

`K` *extends* `string`

##### O

`O`

#### Parameters

##### array

`T`[]

##### mapper

(`item`, `index`) => \[`K`, `O`\]

#### Returns

`Record`\<`K`, `O`\>

#### Deprecated

Use mapArrToObj instead

***

### ~~mapObjectToObject()~~

```ts
const mapObjectToObject: <I, K, O>(obj, mapper) => Record<K, O> = mapObjToObj;
```

Defined in: [packages/utils/src/objUtils.ts:48](https://github.com/lucasols/utils/blob/main/packages/utils/src/objUtils.ts#L48)

#### Type Parameters

##### I

`I` *extends* `Record`\<`string` \| `number` \| `symbol`, `unknown`\>

##### K

`K` *extends* `string` \| `number` \| `symbol`

##### O

`O`

#### Parameters

##### obj

`I`

##### mapper

(`key`, `value`) => \[`K`, `O`\]

#### Returns

`Record`\<`K`, `O`\>

#### Deprecated

Use mapObjToObj instead

## Functions

### addPrefixToObjKeys()

```ts
function addPrefixToObjKeys<T, P>(obj, prefix): AddPrefixToObjKeys<T, P>;
```

Defined in: [packages/utils/src/objUtils.ts:220](https://github.com/lucasols/utils/blob/main/packages/utils/src/objUtils.ts#L220)

#### Type Parameters

##### T

`T` *extends* `Record`\<`string`, `unknown`\>

##### P

`P` *extends* `string`

#### Parameters

##### obj

`T`

##### prefix

`P`

#### Returns

[`AddPrefixToObjKeys`](typingUtils.md#addprefixtoobjkeys)\<`T`, `P`\>

***

### addSuffixToObjKeys()

```ts
function addSuffixToObjKeys<T, S>(obj, suffix): AddSuffixToObjKeys<T, S>;
```

Defined in: [packages/utils/src/objUtils.ts:233](https://github.com/lucasols/utils/blob/main/packages/utils/src/objUtils.ts#L233)

#### Type Parameters

##### T

`T` *extends* `Record`\<`string`, `unknown`\>

##### S

`S` *extends* `string`

#### Parameters

##### obj

`T`

##### suffix

`S`

#### Returns

[`AddSuffixToObjKeys`](typingUtils.md#addsuffixtoobjkeys)\<`T`, `S`\>

***

### filterObjectKeys()

```ts
function filterObjectKeys<T>(obj, predicate): Partial<T>;
```

Defined in: [packages/utils/src/objUtils.ts:86](https://github.com/lucasols/utils/blob/main/packages/utils/src/objUtils.ts#L86)

#### Type Parameters

##### T

`T` *extends* `Record`\<`string`, `unknown`\>

#### Parameters

##### obj

`T`

##### predicate

(`key`, `value`) => `boolean`

#### Returns

`Partial`\<`T`\>

***

### getObjPropertyOrInsert()

```ts
function getObjPropertyOrInsert<T, K>(
   obj, 
   prop, 
insertValue): Exclude<T[K], undefined>;
```

Defined in: [packages/utils/src/objUtils.ts:205](https://github.com/lucasols/utils/blob/main/packages/utils/src/objUtils.ts#L205)

#### Type Parameters

##### T

`T` *extends* `Record`\<`string`, `any`\>

##### K

`K` *extends* `string` \| `number` \| `symbol`

#### Parameters

##### obj

`T`

##### prop

`K`

##### insertValue

() => `Exclude`\<`T`\[`K`\], `undefined`\>

#### Returns

`Exclude`\<`T`\[`K`\], `undefined`\>

***

### getValueFromPath()

```ts
function getValueFromPath(obj, path): Result<unknown, Error>;
```

Defined in: [packages/utils/src/objUtils.ts:107](https://github.com/lucasols/utils/blob/main/packages/utils/src/objUtils.ts#L107)

#### Parameters

##### obj

`Record`\<`string`, `unknown`\>

##### path

`string`

#### Returns

`Result`\<`unknown`, `Error`\>

***

### looseGetObjectProperty()

```ts
function looseGetObjectProperty<T>(obj, key): undefined | T[keyof T];
```

Defined in: [packages/utils/src/objUtils.ts:65](https://github.com/lucasols/utils/blob/main/packages/utils/src/objUtils.ts#L65)

#### Type Parameters

##### T

`T` *extends* `Record`\<`string`, `unknown`\>

#### Parameters

##### obj

`T`

##### key

`string`

#### Returns

`undefined` \| `T`\[keyof `T`\]

***

### mapArrToObj()

```ts
function mapArrToObj<T, K, O>(array, mapper): Record<K, O>;
```

Defined in: [packages/utils/src/objUtils.ts:27](https://github.com/lucasols/utils/blob/main/packages/utils/src/objUtils.ts#L27)

#### Type Parameters

##### T

`T`

##### K

`K` *extends* `string`

##### O

`O`

#### Parameters

##### array

`T`[]

##### mapper

(`item`, `index`) => \[`K`, `O`\]

#### Returns

`Record`\<`K`, `O`\>

***

### mapObjToObj()

```ts
function mapObjToObj<I, K, O>(obj, mapper): Record<K, O>;
```

Defined in: [packages/utils/src/objUtils.ts:37](https://github.com/lucasols/utils/blob/main/packages/utils/src/objUtils.ts#L37)

#### Type Parameters

##### I

`I` *extends* `Record`\<`string` \| `number` \| `symbol`, `unknown`\>

##### K

`K` *extends* `string` \| `number` \| `symbol`

##### O

`O`

#### Parameters

##### obj

`I`

##### mapper

(`key`, `value`) => \[`K`, `O`\]

#### Returns

`Record`\<`K`, `O`\>

***

### ~~objectTypedEntries()~~

```ts
function objectTypedEntries<T>(obj): [Extract<keyof T, string>, T[keyof T]][];
```

Defined in: [packages/utils/src/objUtils.ts:11](https://github.com/lucasols/utils/blob/main/packages/utils/src/objUtils.ts#L11)

#### Type Parameters

##### T

`T` *extends* `Record`\<`string`, `unknown`\>

#### Parameters

##### obj

`T`

#### Returns

\[`Extract`\<keyof `T`, `string`\>, `T`\[keyof `T`\]\][]

#### Deprecated

Use typedObjectEntries from @ls-stack/utils/typingFnUtils instead

***

### omit()

```ts
function omit<T, K>(obj, keys): Omit<T, K>;
```

Defined in: [packages/utils/src/objUtils.ts:50](https://github.com/lucasols/utils/blob/main/packages/utils/src/objUtils.ts#L50)

#### Type Parameters

##### T

`T` *extends* `Record`\<`string`, `unknown`\>

##### K

`K` *extends* `string` \| `number` \| `symbol`

#### Parameters

##### obj

`T`

##### keys

`K`[]

#### Returns

`Omit`\<`T`, `K`\>

***

### pick()

```ts
function pick<T, K>(obj, keys): Pick<T, K>;
```

Defined in: [packages/utils/src/objUtils.ts:15](https://github.com/lucasols/utils/blob/main/packages/utils/src/objUtils.ts#L15)

#### Type Parameters

##### T

`T` *extends* `Record`\<`string`, `unknown`\>

##### K

`K` *extends* `string` \| `number` \| `symbol`

#### Parameters

##### obj

`T`

##### keys

`K`[]

#### Returns

`Pick`\<`T`, `K`\>

***

### rejectObjUndefinedValues()

```ts
function rejectObjUndefinedValues<T>(obj): { [P in string | number | symbol]: (Partial<Pick<T, PickUndefinedKeys<T>>> & Pick<T, PickRequiredKeys<T>>)[P] };
```

Defined in: [packages/utils/src/objUtils.ts:72](https://github.com/lucasols/utils/blob/main/packages/utils/src/objUtils.ts#L72)

#### Type Parameters

##### T

`T` *extends* `Record`\<`string`, `unknown`\>

#### Parameters

##### obj

`T`

#### Returns

\{ \[P in string \| number \| symbol\]: (Partial\<Pick\<T, PickUndefinedKeys\<T\>\>\> & Pick\<T, PickRequiredKeys\<T\>\>)\[P\] \}

***

### sortObjectKeys()

```ts
function sortObjectKeys<T>(
   obj, 
   sortByFn, 
   options?): T;
```

Defined in: [packages/utils/src/objUtils.ts:97](https://github.com/lucasols/utils/blob/main/packages/utils/src/objUtils.ts#L97)

#### Type Parameters

##### T

`T` *extends* `Record`\<`string`, `unknown`\>

#### Parameters

##### obj

`T`

##### sortByFn

[`SortByValueFn`](arrayUtils/index.md#sortbyvaluefn)\<\[keyof `T`, `T`\[keyof `T`\]\]\>

##### options?

[`SortByProps`](arrayUtils/index.md#sortbyprops)

#### Returns

`T`
