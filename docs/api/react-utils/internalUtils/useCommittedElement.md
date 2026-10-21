[@ls-stack/react-utils](../modules.md) / internalUtils/useCommittedElement

# internalUtils/useCommittedElement

## Type Aliases

### ElementTarget

```ts
type ElementTarget = RefObject<HTMLElement | null> | HTMLElement | null;
```

Defined in: [react-utils/src/internalUtils/useCommittedElement.ts:4](https://github.com/lucasols/utils/blob/main/packages/react-utils/src/internalUtils/useCommittedElement.ts#L4)

## Functions

### isCommittedElementOutdated()

```ts
function isCommittedElementOutdated(target, element): boolean;
```

Defined in: [react-utils/src/internalUtils/useCommittedElement.ts:30](https://github.com/lucasols/utils/blob/main/packages/react-utils/src/internalUtils/useCommittedElement.ts#L30)

Whether the element returned by `useCommittedElement` is behind the element
now attached to the `target` ref (the ref was switched or attached to another
element in this commit). The update to the attached element is then already
scheduled (or the element is recreated on every render and can't be
followed), so effects should skip this commit instead of using the outdated
element.

#### Parameters

##### target

[`ElementTarget`](#elementtarget)

##### element

`HTMLElement` | `null`

#### Returns

`boolean`

***

### resolveElementTarget()

```ts
function resolveElementTarget(target): HTMLElement | null;
```

Defined in: [react-utils/src/internalUtils/useCommittedElement.ts:14](https://github.com/lucasols/utils/blob/main/packages/react-utils/src/internalUtils/useCommittedElement.ts#L14)

#### Parameters

##### target

[`ElementTarget`](#elementtarget)

#### Returns

`HTMLElement` \| `null`

***

### useCommittedElement()

```ts
function useCommittedElement(target): HTMLElement | null;
```

Defined in: [react-utils/src/internalUtils/useCommittedElement.ts:45](https://github.com/lucasols/utils/blob/main/packages/react-utils/src/internalUtils/useCommittedElement.ts#L45)

Returns the element committed for `target`. An element is returned as is, a
ref is read again after every commit, so the result follows the element
attached to it instead of the one read during render.

A ref whose element is recreated on every render can't be followed, the
resync stops after a few consecutive commits instead of looping.

#### Parameters

##### target

[`ElementTarget`](#elementtarget)

#### Returns

`HTMLElement` \| `null`
