[@ls-stack/react-utils](../modules.md) / [useComponentEvents](index.md) / \<internal\>

# \<internal\>

## Type Aliases

### SendEvent()\<E\>

```ts
type SendEvent<E> = <T>(event, ...args) => void;
```

Defined in: [packages/react-utils/src/useComponentEvents.ts:8](https://github.com/lucasols/utils/blob/main/packages/react-utils/src/useComponentEvents.ts#L8)

#### Type Parameters

##### E

`E` *extends* `Record`\<`string`, `unknown`\>

#### Type Parameters

##### T

`T` *extends* keyof `E`

#### Parameters

##### event

`T`

##### args

...`E`\[`T`\] *extends* `undefined` ? \[\] : \[`E`\[`T`\]\]

#### Returns

`void`
