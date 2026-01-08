[@ls-stack/utils](../modules.md) / diffParser

# diffParser

## Modules

- [\<internal\>](-internal-.md)

## Type Aliases

### DiffFile

```ts
type DiffFile = 
  | DiffFileModified
  | DiffFileNew
  | DiffFileDeleted
  | DiffFileRenamed
  | DiffFileBinary
  | DiffFileCombined;
```

Defined in: [packages/utils/src/diffParser.ts:84](https://github.com/lucasols/utils/blob/main/packages/utils/src/diffParser.ts#L84)

## Functions

### diffParser()

```ts
function diffParser(input): DiffFile[];
```

Defined in: [packages/utils/src/diffParser.ts:92](https://github.com/lucasols/utils/blob/main/packages/utils/src/diffParser.ts#L92)

#### Parameters

##### input

`string`

#### Returns

[`DiffFile`](#difffile)[]
