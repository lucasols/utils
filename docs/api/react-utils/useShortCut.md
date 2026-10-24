[@ls-stack/react-utils](modules.md) / useShortCut

# useShortCut

## Functions

### preventShortcutDefault()

```ts
function preventShortcutDefault(callback): (e) => void;
```

Defined in: [react-utils/src/useShortCut.ts:54](https://github.com/lucasols/utils/blob/main/packages/react-utils/src/useShortCut.ts#L54)

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

Defined in: [react-utils/src/useShortCut.ts:7](https://github.com/lucasols/utils/blob/main/packages/react-utils/src/useShortCut.ts#L7)

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

Defined in: [react-utils/src/useShortCut.ts:35](https://github.com/lucasols/utils/blob/main/packages/react-utils/src/useShortCut.ts#L35)

#### Parameters

##### shortcuts

`Record`\<`string`, (`event`) => `void`\>

##### \_\_namedParameters

###### allowDuringTyping?

`boolean`

#### Returns

`void`
