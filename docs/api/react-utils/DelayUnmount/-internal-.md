[@ls-stack/react-utils](../modules.md) / [DelayUnmount](index.md) / \<internal\>

# \<internal\>

## Type Aliases

### Props

```ts
type Props = object;
```

Defined in: [packages/react-utils/src/DelayUnmount.ts:4](https://github.com/lucasols/utils/blob/main/packages/react-utils/src/DelayUnmount.ts#L4)

#### Properties

##### children

```ts
children: JSX.Element | null | false;
```

Defined in: [packages/react-utils/src/DelayUnmount.ts:8](https://github.com/lucasols/utils/blob/main/packages/react-utils/src/DelayUnmount.ts#L8)

The children to render. When set to null or false, the component will delay unmounting for the specified delay period

##### delay

```ts
delay: number;
```

Defined in: [packages/react-utils/src/DelayUnmount.ts:6](https://github.com/lucasols/utils/blob/main/packages/react-utils/src/DelayUnmount.ts#L6)

Delay in milliseconds before unmounting the children
