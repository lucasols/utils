[@ls-stack/react-utils](../modules.md) / jsxUtils

# jsxUtils

## Modules

- [\<internal\>](-internal-.md)

## Functions

### repeatJsx()

```ts
function repeatJsx<T>(times, element): ReactNode;
```

Defined in: [packages/react-utils/src/jsxUtils.ts:124](https://github.com/lucasols/utils/blob/main/packages/react-utils/src/jsxUtils.ts#L124)

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

Defined in: [packages/react-utils/src/jsxUtils.ts:29](https://github.com/lucasols/utils/blob/main/packages/react-utils/src/jsxUtils.ts#L29)

#### Parameters

##### string

`string`

##### replacers

[`Replacer`](-internal-.md#replacer)[]

#### Returns

`ReactNode`
