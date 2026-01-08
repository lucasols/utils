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

Defined in: [packages/utils/src/diffParser.ts:91](https://github.com/lucasols/utils/blob/main/packages/utils/src/diffParser.ts#L91)

Parsed diff file metadata and hunks.

The `type` discriminator indicates the kind of change this diff represents.
Combined diffs (e.g. `diff --cc`) may include multiple parent paths via
`froms`.

## Functions

### diffParser()

```ts
function diffParser(input): DiffFile[];
```

Defined in: [packages/utils/src/diffParser.ts:107](https://github.com/lucasols/utils/blob/main/packages/utils/src/diffParser.ts#L107)

Parse unified diff text (git, hg, svn) into structured file hunks.

#### Parameters

##### input

`string`

#### Returns

[`DiffFile`](#difffile)[]

#### Example

```ts
const files = diffParser('@@ -1 +1 @@\\n-old\\n+new');
```
