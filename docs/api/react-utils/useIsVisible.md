[@ls-stack/react-utils](modules.md) / useIsVisible

# useIsVisible

## Functions

### useIsVisible()

```ts
function useIsVisible(target, __namedParameters): boolean;
```

Defined in: [react-utils/src/useIsVisible.ts:23](https://github.com/lucasols/utils/blob/main/packages/react-utils/src/useIsVisible.ts#L23)

Tracks whether the target element intersects the viewport (or the closest
`margin.rootSelector` ancestor) using an `IntersectionObserver`.

The target can be a ref or the element itself. A ref is read again after
every commit of the component that uses the hook, pass the element (e.g. from
a `useState` callback ref) when it can be attached, replaced or removed by a
child component without this one re-rendering.

`margin` and `onVisibilityChange` must be memoized, the observer is recreated
when they change.

#### Parameters

##### target

[`ElementTarget`](internalUtils/useCommittedElement.md#elementtarget)

##### \_\_namedParameters

###### disabled?

`boolean`

###### initialVisibility?

`boolean` = `false`

###### margin?

\{
  `margin`:   \| `string`
     \| `number`
     \| \{
     `block?`: `number`;
     `inline?`: `number`;
   \};
  `rootSelector`: `string`;
\}

###### margin.margin

  \| `string`
  \| `number`
  \| \{
  `block?`: `number`;
  `inline?`: `number`;
\}

###### margin.rootSelector

`string`

###### onVisibilityChange?

(`isVisible`) => `void`

###### threshold?

`number` = `0`

Value from 0 to 1, default is 0 (as soon any pixel is visible the
visibility will be true)

#### Returns

`boolean`
