[@ls-stack/react-utils](../modules.md) / useRenderMemoizer

# useRenderMemoizer

## Modules

- [\<internal\>](-internal-.md)

## Functions

### useRenderMemoizer()

```ts
function useRenderMemoizer(): RenderMemoizer;
```

Defined in: [react-utils/src/useRenderMemoizer.ts:29](https://github.com/lucasols/utils/blob/main/packages/react-utils/src/useRenderMemoizer.ts#L29)

Render-scoped memoization cache keyed by string. Keys not used during a
render are dropped after it commits.

#### Returns

[`RenderMemoizer`](-internal-.md#rendermemoizer)
