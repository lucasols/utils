[@ls-stack/react-utils](modules.md) / jsxUtils

# jsxUtils

## Type Aliases

### Replacer

```ts
type Replacer = object;
```

Defined in: [react-utils/src/jsxUtils.ts:5](https://github.com/lucasols/utils/blob/main/packages/react-utils/src/jsxUtils.ts#L5)

#### Properties

##### fn()

```ts
fn: (fullMatch, groups) => ReactElement;
```

Defined in: [react-utils/src/jsxUtils.ts:7](https://github.com/lucasols/utils/blob/main/packages/react-utils/src/jsxUtils.ts#L7)

###### Parameters

###### fullMatch

`string`

###### groups

(`string` \| `undefined`)[]

###### Returns

`ReactElement`

##### match

```ts
match: RegExp | string;
```

Defined in: [react-utils/src/jsxUtils.ts:6](https://github.com/lucasols/utils/blob/main/packages/react-utils/src/jsxUtils.ts#L6)

## Functions

### repeatJsx()

```ts
function repeatJsx<T>(times, element): ReactNode;
```

Defined in: [react-utils/src/jsxUtils.ts:127](https://github.com/lucasols/utils/blob/main/packages/react-utils/src/jsxUtils.ts#L127)

#### Type Parameters

##### T

`T` *extends* `ReactElement`\<`unknown`, `string` \| `JSXElementConstructor`\<`any`\>\>

#### Parameters

##### times

`number`

##### element

`T`

#### Returns

`ReactNode`

***

### replaceStringWithJSX()

```ts
function replaceStringWithJSX(string, replacers): ReactNode;
```

Defined in: [react-utils/src/jsxUtils.ts:38](https://github.com/lucasols/utils/blob/main/packages/react-utils/src/jsxUtils.ts#L38)

#### Parameters

##### string

`string`

##### replacers

[`Replacer`](#replacer)[]

#### Returns

`ReactNode`
