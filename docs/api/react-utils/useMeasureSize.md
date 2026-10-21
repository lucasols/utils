[@ls-stack/react-utils](modules.md) / useMeasureSize

# useMeasureSize

## Functions

### useMeasureSize()

```ts
function useMeasureSize(
   target, 
   debounceMs, 
   __namedParameters): object;
```

Defined in: [react-utils/src/useMeasureSize.ts:18](https://github.com/lucasols/utils/blob/main/packages/react-utils/src/useMeasureSize.ts#L18)

Measures an element's size with a `ResizeObserver`. Pass an element ref, the
element itself, or attach the returned `setRef` to the element.

A ref is read again after every commit of the component that uses the hook,
use `setRef` or pass the element when it can be attached, replaced or removed
by a child component without this one re-rendering.

#### Parameters

##### target

[`ElementTarget`](internalUtils/useCommittedElement.md#elementtarget)

##### debounceMs

`number` = `100`

##### \_\_namedParameters

###### disable?

`boolean`

###### getInitialHeight?

() => `number`

###### getInitialWidth?

() => `number`

###### measureOnly?

`"width"` \| `"height"`

###### useContentRect?

`boolean` \| `"width"` \| `"height"`

#### Returns

`object`

##### height

```ts
height: number;
```

##### isMeasuring

```ts
isMeasuring: boolean;
```

##### refElement

```ts
refElement: HTMLElement | null;
```

##### setRef()

```ts
setRef: (ref) => void;
```

###### Parameters

###### ref

`HTMLElement` | `null`

###### Returns

`void`

##### width

```ts
width: number;
```
