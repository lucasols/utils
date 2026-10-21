[@ls-stack/react-utils](modules.md) / useAnimateMountUnmount

# useAnimateMountUnmount

## Type Aliases

### MountAnimStates

```ts
type MountAnimStates = "from" | "enter" | "leave" | "unmounted";
```

Defined in: [react-utils/src/useAnimateMountUnmount.ts:4](https://github.com/lucasols/utils/blob/main/packages/react-utils/src/useAnimateMountUnmount.ts#L4)

## Functions

### useAnimateMountUnmount()

```ts
function useAnimateMountUnmount(show, animationMaxDurationMs): [MountAnimStates, boolean];
```

Defined in: [react-utils/src/useAnimateMountUnmount.ts:17](https://github.com/lucasols/utils/blob/main/packages/react-utils/src/useAnimateMountUnmount.ts#L17)

React hook to manage mount/unmount animation states for a component.

Returns the current animation state and a boolean indicating whether the element should be rendered.

#### Parameters

##### show

`boolean`

Whether the component should be shown (mounted)

##### animationMaxDurationMs

`number`

Maximum duration (ms) for the leave animation before unmounting

#### Returns

\[[`MountAnimStates`](#mountanimstates), `boolean`\]

[animState, renderElement]
  - animState: 'from' | 'enter' | 'leave' | 'unmounted'
  - renderElement: boolean (true if the element should be rendered)
