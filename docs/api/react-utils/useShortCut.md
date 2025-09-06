[@ls-stack/react-utils](modules.md) / useShortCut

# useShortCut

## Functions

### preventShortcutDefault()

```ts
function preventShortcutDefault(callback): (e) => void;
```

Defined in: [packages/react-utils/src/useShortCut.ts:62](https://github.com/lucasols/utils/blob/main/packages/react-utils/src/useShortCut.ts#L62)

#### Parameters

##### callback

(`event`) => `void`

#### Returns

```ts
(e): void;
```

##### Parameters

###### e

`KeyboardEvent`

##### Returns

`void`

***

### useShortCut()

```ts
function useShortCut(
   shortcut, 
   callback, 
   __namedParameters): void;
```

Defined in: [packages/react-utils/src/useShortCut.ts:8](https://github.com/lucasols/utils/blob/main/packages/react-utils/src/useShortCut.ts#L8)

#### Parameters

##### shortcut

`string`

##### callback

(`event`) => `void`

##### \_\_namedParameters

###### allowDuringTyping?

`boolean`

#### Returns

`void`

***

### useShortCuts()

```ts
function useShortCuts(shortcuts, __namedParameters): void;
```

Defined in: [packages/react-utils/src/useShortCut.ts:38](https://github.com/lucasols/utils/blob/main/packages/react-utils/src/useShortCut.ts#L38)

#### Parameters

##### shortcuts

`Record`\<`string`, (`event`) => `void`\>

##### \_\_namedParameters

###### allowDuringTyping?

`boolean`

#### Returns

`void`
