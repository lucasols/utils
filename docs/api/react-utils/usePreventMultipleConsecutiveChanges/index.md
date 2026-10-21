[@ls-stack/react-utils](../modules.md) / usePreventMultipleConsecutiveChanges

# usePreventMultipleConsecutiveChanges

## Modules

- [\<internal\>](-internal-.md)

## Functions

### usePreventMultipleConsecutiveChanges()

```ts
function usePreventMultipleConsecutiveChanges(changeKey, minTimeBetweenChangesMs): boolean;
```

Defined in: [react-utils/src/usePreventMultipleConsecutiveChanges.ts:30](https://github.com/lucasols/utils/blob/main/packages/react-utils/src/usePreventMultipleConsecutiveChanges.ts#L30)

Returns `true` while a `changeKey` change happened less than
`minTimeBetweenChangesMs` after the previous one, e.g. to show a loading
state instead of flickering between quick changes.

#### Parameters

##### changeKey

[`ChangeKey`](-internal-.md#changekey)

##### minTimeBetweenChangesMs

`number`

#### Returns

`boolean`
