[**@ls-stack/react-utils**](../README.md)

***

[@ls-stack/react-utils](../modules.md) / useOnClickOutside

# useOnClickOutside

## Modules

- [\<internal\>](-internal-.md)

## Functions

### useOnClickOutside()

```ts
function useOnClickOutside(ref, handler): void;
```

Defined in: [packages/react-utils/src/useOnClickOutside.ts:38](https://github.com/lucasols/utils/blob/main/packages/react-utils/src/useOnClickOutside.ts#L38)

React hook that triggers a handler when a click or touch event occurs outside the specified element(s).

Useful for closing popovers, modals, or dropdowns when the user clicks outside.

#### Parameters

##### ref

A single ref, DOM element, selector string, or an array of these, representing the element(s) to detect outside clicks for

[`Ref`](-internal-.md#ref) | [`Ref`](-internal-.md#ref)[]

##### handler

(`event`) => `void`

Function called when a click or touch event occurs outside the specified element(s)

#### Returns

`void`

#### Example

```tsx
const ref = useRef<HTMLDivElement>(null);
useOnClickOutside(ref, () => setOpen(false));
```
