[@ls-stack/utils](../modules.md) / [diffParser](index.md) / \<internal\>

# \<internal\>

## Interfaces

### Change

Defined in: [packages/utils/src/diffParser.ts:1](https://github.com/lucasols/utils/blob/main/packages/utils/src/diffParser.ts#L1)

#### Properties

##### add?

```ts
optional add: boolean;
```

Defined in: [packages/utils/src/diffParser.ts:5](https://github.com/lucasols/utils/blob/main/packages/utils/src/diffParser.ts#L5)

##### content

```ts
content: string;
```

Defined in: [packages/utils/src/diffParser.ts:9](https://github.com/lucasols/utils/blob/main/packages/utils/src/diffParser.ts#L9)

##### del?

```ts
optional del: boolean;
```

Defined in: [packages/utils/src/diffParser.ts:4](https://github.com/lucasols/utils/blob/main/packages/utils/src/diffParser.ts#L4)

##### ln?

```ts
optional ln: number;
```

Defined in: [packages/utils/src/diffParser.ts:8](https://github.com/lucasols/utils/blob/main/packages/utils/src/diffParser.ts#L8)

##### ln1?

```ts
optional ln1: number;
```

Defined in: [packages/utils/src/diffParser.ts:6](https://github.com/lucasols/utils/blob/main/packages/utils/src/diffParser.ts#L6)

##### ln2?

```ts
optional ln2: number;
```

Defined in: [packages/utils/src/diffParser.ts:7](https://github.com/lucasols/utils/blob/main/packages/utils/src/diffParser.ts#L7)

##### normal?

```ts
optional normal: boolean;
```

Defined in: [packages/utils/src/diffParser.ts:3](https://github.com/lucasols/utils/blob/main/packages/utils/src/diffParser.ts#L3)

##### type

```ts
type: "add" | "normal" | "del";
```

Defined in: [packages/utils/src/diffParser.ts:2](https://github.com/lucasols/utils/blob/main/packages/utils/src/diffParser.ts#L2)

***

### Chunk

Defined in: [packages/utils/src/diffParser.ts:17](https://github.com/lucasols/utils/blob/main/packages/utils/src/diffParser.ts#L17)

#### Properties

##### changes

```ts
changes: Change[];
```

Defined in: [packages/utils/src/diffParser.ts:19](https://github.com/lucasols/utils/blob/main/packages/utils/src/diffParser.ts#L19)

##### combined?

```ts
optional combined: boolean;
```

Defined in: [packages/utils/src/diffParser.ts:24](https://github.com/lucasols/utils/blob/main/packages/utils/src/diffParser.ts#L24)

##### content

```ts
content: string;
```

Defined in: [packages/utils/src/diffParser.ts:18](https://github.com/lucasols/utils/blob/main/packages/utils/src/diffParser.ts#L18)

##### newLines

```ts
newLines: number;
```

Defined in: [packages/utils/src/diffParser.ts:23](https://github.com/lucasols/utils/blob/main/packages/utils/src/diffParser.ts#L23)

##### newStart

```ts
newStart: number;
```

Defined in: [packages/utils/src/diffParser.ts:22](https://github.com/lucasols/utils/blob/main/packages/utils/src/diffParser.ts#L22)

##### oldLines

```ts
oldLines: number;
```

Defined in: [packages/utils/src/diffParser.ts:21](https://github.com/lucasols/utils/blob/main/packages/utils/src/diffParser.ts#L21)

##### oldRanges?

```ts
optional oldRanges: ParentRange[];
```

Defined in: [packages/utils/src/diffParser.ts:26](https://github.com/lucasols/utils/blob/main/packages/utils/src/diffParser.ts#L26)

##### oldStart

```ts
oldStart: number;
```

Defined in: [packages/utils/src/diffParser.ts:20](https://github.com/lucasols/utils/blob/main/packages/utils/src/diffParser.ts#L20)

##### parentCount?

```ts
optional parentCount: number;
```

Defined in: [packages/utils/src/diffParser.ts:25](https://github.com/lucasols/utils/blob/main/packages/utils/src/diffParser.ts#L25)

***

### DiffFileBase

Defined in: [packages/utils/src/diffParser.ts:45](https://github.com/lucasols/utils/blob/main/packages/utils/src/diffParser.ts#L45)

#### Extended by

- [`DiffFileModified`](#difffilemodified)
- [`DiffFileNew`](#difffilenew)
- [`DiffFileDeleted`](#difffiledeleted)
- [`DiffFileRenamed`](#difffilerenamed)
- [`DiffFileBinary`](#difffilebinary)
- [`DiffFileCombined`](#difffilecombined)

#### Properties

##### additions

```ts
additions: number;
```

Defined in: [packages/utils/src/diffParser.ts:49](https://github.com/lucasols/utils/blob/main/packages/utils/src/diffParser.ts#L49)

##### chunks

```ts
chunks: Chunk[];
```

Defined in: [packages/utils/src/diffParser.ts:47](https://github.com/lucasols/utils/blob/main/packages/utils/src/diffParser.ts#L47)

##### deletions

```ts
deletions: number;
```

Defined in: [packages/utils/src/diffParser.ts:48](https://github.com/lucasols/utils/blob/main/packages/utils/src/diffParser.ts#L48)

##### diff

```ts
diff: undefined | string;
```

Defined in: [packages/utils/src/diffParser.ts:55](https://github.com/lucasols/utils/blob/main/packages/utils/src/diffParser.ts#L55)

##### from

```ts
from: undefined | string;
```

Defined in: [packages/utils/src/diffParser.ts:50](https://github.com/lucasols/utils/blob/main/packages/utils/src/diffParser.ts#L50)

##### index

```ts
index: undefined | string[];
```

Defined in: [packages/utils/src/diffParser.ts:54](https://github.com/lucasols/utils/blob/main/packages/utils/src/diffParser.ts#L54)

##### newMode

```ts
newMode: undefined | string;
```

Defined in: [packages/utils/src/diffParser.ts:53](https://github.com/lucasols/utils/blob/main/packages/utils/src/diffParser.ts#L53)

##### oldMode

```ts
oldMode: undefined | string;
```

Defined in: [packages/utils/src/diffParser.ts:52](https://github.com/lucasols/utils/blob/main/packages/utils/src/diffParser.ts#L52)

##### rawDiff

```ts
rawDiff: string;
```

Defined in: [packages/utils/src/diffParser.ts:56](https://github.com/lucasols/utils/blob/main/packages/utils/src/diffParser.ts#L56)

##### to

```ts
to: undefined | string;
```

Defined in: [packages/utils/src/diffParser.ts:51](https://github.com/lucasols/utils/blob/main/packages/utils/src/diffParser.ts#L51)

##### type

```ts
type: DiffFileType;
```

Defined in: [packages/utils/src/diffParser.ts:46](https://github.com/lucasols/utils/blob/main/packages/utils/src/diffParser.ts#L46)

***

### DiffFileBinary

Defined in: [packages/utils/src/diffParser.ts:76](https://github.com/lucasols/utils/blob/main/packages/utils/src/diffParser.ts#L76)

#### Extends

- [`DiffFileBase`](#difffilebase)

#### Properties

##### additions

```ts
additions: number;
```

Defined in: [packages/utils/src/diffParser.ts:49](https://github.com/lucasols/utils/blob/main/packages/utils/src/diffParser.ts#L49)

###### Inherited from

[`DiffFileBase`](#difffilebase).[`additions`](#additions)

##### chunks

```ts
chunks: Chunk[];
```

Defined in: [packages/utils/src/diffParser.ts:47](https://github.com/lucasols/utils/blob/main/packages/utils/src/diffParser.ts#L47)

###### Inherited from

[`DiffFileBase`](#difffilebase).[`chunks`](#chunks)

##### deletions

```ts
deletions: number;
```

Defined in: [packages/utils/src/diffParser.ts:48](https://github.com/lucasols/utils/blob/main/packages/utils/src/diffParser.ts#L48)

###### Inherited from

[`DiffFileBase`](#difffilebase).[`deletions`](#deletions)

##### diff

```ts
diff: undefined | string;
```

Defined in: [packages/utils/src/diffParser.ts:55](https://github.com/lucasols/utils/blob/main/packages/utils/src/diffParser.ts#L55)

###### Inherited from

[`DiffFileBase`](#difffilebase).[`diff`](#diff)

##### from

```ts
from: undefined | string;
```

Defined in: [packages/utils/src/diffParser.ts:50](https://github.com/lucasols/utils/blob/main/packages/utils/src/diffParser.ts#L50)

###### Inherited from

[`DiffFileBase`](#difffilebase).[`from`](#from)

##### index

```ts
index: undefined | string[];
```

Defined in: [packages/utils/src/diffParser.ts:54](https://github.com/lucasols/utils/blob/main/packages/utils/src/diffParser.ts#L54)

###### Inherited from

[`DiffFileBase`](#difffilebase).[`index`](#index)

##### newMode

```ts
newMode: undefined | string;
```

Defined in: [packages/utils/src/diffParser.ts:53](https://github.com/lucasols/utils/blob/main/packages/utils/src/diffParser.ts#L53)

###### Inherited from

[`DiffFileBase`](#difffilebase).[`newMode`](#newmode)

##### oldMode

```ts
oldMode: undefined | string;
```

Defined in: [packages/utils/src/diffParser.ts:52](https://github.com/lucasols/utils/blob/main/packages/utils/src/diffParser.ts#L52)

###### Inherited from

[`DiffFileBase`](#difffilebase).[`oldMode`](#oldmode)

##### rawDiff

```ts
rawDiff: string;
```

Defined in: [packages/utils/src/diffParser.ts:56](https://github.com/lucasols/utils/blob/main/packages/utils/src/diffParser.ts#L56)

###### Inherited from

[`DiffFileBase`](#difffilebase).[`rawDiff`](#rawdiff)

##### to

```ts
to: undefined | string;
```

Defined in: [packages/utils/src/diffParser.ts:51](https://github.com/lucasols/utils/blob/main/packages/utils/src/diffParser.ts#L51)

###### Inherited from

[`DiffFileBase`](#difffilebase).[`to`](#to)

##### type

```ts
type: "binary";
```

Defined in: [packages/utils/src/diffParser.ts:77](https://github.com/lucasols/utils/blob/main/packages/utils/src/diffParser.ts#L77)

###### Overrides

[`DiffFileBase`](#difffilebase).[`type`](#type-1)

***

### DiffFileCombined

Defined in: [packages/utils/src/diffParser.ts:80](https://github.com/lucasols/utils/blob/main/packages/utils/src/diffParser.ts#L80)

#### Extends

- [`DiffFileBase`](#difffilebase)

#### Properties

##### additions

```ts
additions: number;
```

Defined in: [packages/utils/src/diffParser.ts:49](https://github.com/lucasols/utils/blob/main/packages/utils/src/diffParser.ts#L49)

###### Inherited from

[`DiffFileBase`](#difffilebase).[`additions`](#additions)

##### chunks

```ts
chunks: Chunk[];
```

Defined in: [packages/utils/src/diffParser.ts:47](https://github.com/lucasols/utils/blob/main/packages/utils/src/diffParser.ts#L47)

###### Inherited from

[`DiffFileBase`](#difffilebase).[`chunks`](#chunks)

##### deletions

```ts
deletions: number;
```

Defined in: [packages/utils/src/diffParser.ts:48](https://github.com/lucasols/utils/blob/main/packages/utils/src/diffParser.ts#L48)

###### Inherited from

[`DiffFileBase`](#difffilebase).[`deletions`](#deletions)

##### diff

```ts
diff: undefined | string;
```

Defined in: [packages/utils/src/diffParser.ts:55](https://github.com/lucasols/utils/blob/main/packages/utils/src/diffParser.ts#L55)

###### Inherited from

[`DiffFileBase`](#difffilebase).[`diff`](#diff)

##### from

```ts
from: undefined | string;
```

Defined in: [packages/utils/src/diffParser.ts:50](https://github.com/lucasols/utils/blob/main/packages/utils/src/diffParser.ts#L50)

###### Inherited from

[`DiffFileBase`](#difffilebase).[`from`](#from)

##### froms

```ts
froms: undefined | string[];
```

Defined in: [packages/utils/src/diffParser.ts:82](https://github.com/lucasols/utils/blob/main/packages/utils/src/diffParser.ts#L82)

##### index

```ts
index: undefined | string[];
```

Defined in: [packages/utils/src/diffParser.ts:54](https://github.com/lucasols/utils/blob/main/packages/utils/src/diffParser.ts#L54)

###### Inherited from

[`DiffFileBase`](#difffilebase).[`index`](#index)

##### newMode

```ts
newMode: undefined | string;
```

Defined in: [packages/utils/src/diffParser.ts:53](https://github.com/lucasols/utils/blob/main/packages/utils/src/diffParser.ts#L53)

###### Inherited from

[`DiffFileBase`](#difffilebase).[`newMode`](#newmode)

##### oldMode

```ts
oldMode: undefined | string;
```

Defined in: [packages/utils/src/diffParser.ts:52](https://github.com/lucasols/utils/blob/main/packages/utils/src/diffParser.ts#L52)

###### Inherited from

[`DiffFileBase`](#difffilebase).[`oldMode`](#oldmode)

##### rawDiff

```ts
rawDiff: string;
```

Defined in: [packages/utils/src/diffParser.ts:56](https://github.com/lucasols/utils/blob/main/packages/utils/src/diffParser.ts#L56)

###### Inherited from

[`DiffFileBase`](#difffilebase).[`rawDiff`](#rawdiff)

##### to

```ts
to: undefined | string;
```

Defined in: [packages/utils/src/diffParser.ts:51](https://github.com/lucasols/utils/blob/main/packages/utils/src/diffParser.ts#L51)

###### Inherited from

[`DiffFileBase`](#difffilebase).[`to`](#to)

##### type

```ts
type: "combined";
```

Defined in: [packages/utils/src/diffParser.ts:81](https://github.com/lucasols/utils/blob/main/packages/utils/src/diffParser.ts#L81)

###### Overrides

[`DiffFileBase`](#difffilebase).[`type`](#type-1)

***

### DiffFileDeleted

Defined in: [packages/utils/src/diffParser.ts:67](https://github.com/lucasols/utils/blob/main/packages/utils/src/diffParser.ts#L67)

#### Extends

- [`DiffFileBase`](#difffilebase)

#### Properties

##### additions

```ts
additions: number;
```

Defined in: [packages/utils/src/diffParser.ts:49](https://github.com/lucasols/utils/blob/main/packages/utils/src/diffParser.ts#L49)

###### Inherited from

[`DiffFileBase`](#difffilebase).[`additions`](#additions)

##### chunks

```ts
chunks: Chunk[];
```

Defined in: [packages/utils/src/diffParser.ts:47](https://github.com/lucasols/utils/blob/main/packages/utils/src/diffParser.ts#L47)

###### Inherited from

[`DiffFileBase`](#difffilebase).[`chunks`](#chunks)

##### deletions

```ts
deletions: number;
```

Defined in: [packages/utils/src/diffParser.ts:48](https://github.com/lucasols/utils/blob/main/packages/utils/src/diffParser.ts#L48)

###### Inherited from

[`DiffFileBase`](#difffilebase).[`deletions`](#deletions)

##### diff

```ts
diff: undefined | string;
```

Defined in: [packages/utils/src/diffParser.ts:55](https://github.com/lucasols/utils/blob/main/packages/utils/src/diffParser.ts#L55)

###### Inherited from

[`DiffFileBase`](#difffilebase).[`diff`](#diff)

##### from

```ts
from: undefined | string;
```

Defined in: [packages/utils/src/diffParser.ts:50](https://github.com/lucasols/utils/blob/main/packages/utils/src/diffParser.ts#L50)

###### Inherited from

[`DiffFileBase`](#difffilebase).[`from`](#from)

##### index

```ts
index: undefined | string[];
```

Defined in: [packages/utils/src/diffParser.ts:54](https://github.com/lucasols/utils/blob/main/packages/utils/src/diffParser.ts#L54)

###### Inherited from

[`DiffFileBase`](#difffilebase).[`index`](#index)

##### newMode

```ts
newMode: undefined | string;
```

Defined in: [packages/utils/src/diffParser.ts:53](https://github.com/lucasols/utils/blob/main/packages/utils/src/diffParser.ts#L53)

###### Inherited from

[`DiffFileBase`](#difffilebase).[`newMode`](#newmode)

##### oldMode

```ts
oldMode: undefined | string;
```

Defined in: [packages/utils/src/diffParser.ts:52](https://github.com/lucasols/utils/blob/main/packages/utils/src/diffParser.ts#L52)

###### Inherited from

[`DiffFileBase`](#difffilebase).[`oldMode`](#oldmode)

##### rawDiff

```ts
rawDiff: string;
```

Defined in: [packages/utils/src/diffParser.ts:56](https://github.com/lucasols/utils/blob/main/packages/utils/src/diffParser.ts#L56)

###### Inherited from

[`DiffFileBase`](#difffilebase).[`rawDiff`](#rawdiff)

##### to

```ts
to: undefined | string;
```

Defined in: [packages/utils/src/diffParser.ts:51](https://github.com/lucasols/utils/blob/main/packages/utils/src/diffParser.ts#L51)

###### Inherited from

[`DiffFileBase`](#difffilebase).[`to`](#to)

##### type

```ts
type: "deleted";
```

Defined in: [packages/utils/src/diffParser.ts:68](https://github.com/lucasols/utils/blob/main/packages/utils/src/diffParser.ts#L68)

###### Overrides

[`DiffFileBase`](#difffilebase).[`type`](#type-1)

***

### DiffFileModified

Defined in: [packages/utils/src/diffParser.ts:59](https://github.com/lucasols/utils/blob/main/packages/utils/src/diffParser.ts#L59)

#### Extends

- [`DiffFileBase`](#difffilebase)

#### Properties

##### additions

```ts
additions: number;
```

Defined in: [packages/utils/src/diffParser.ts:49](https://github.com/lucasols/utils/blob/main/packages/utils/src/diffParser.ts#L49)

###### Inherited from

[`DiffFileBase`](#difffilebase).[`additions`](#additions)

##### chunks

```ts
chunks: Chunk[];
```

Defined in: [packages/utils/src/diffParser.ts:47](https://github.com/lucasols/utils/blob/main/packages/utils/src/diffParser.ts#L47)

###### Inherited from

[`DiffFileBase`](#difffilebase).[`chunks`](#chunks)

##### deletions

```ts
deletions: number;
```

Defined in: [packages/utils/src/diffParser.ts:48](https://github.com/lucasols/utils/blob/main/packages/utils/src/diffParser.ts#L48)

###### Inherited from

[`DiffFileBase`](#difffilebase).[`deletions`](#deletions)

##### diff

```ts
diff: undefined | string;
```

Defined in: [packages/utils/src/diffParser.ts:55](https://github.com/lucasols/utils/blob/main/packages/utils/src/diffParser.ts#L55)

###### Inherited from

[`DiffFileBase`](#difffilebase).[`diff`](#diff)

##### from

```ts
from: undefined | string;
```

Defined in: [packages/utils/src/diffParser.ts:50](https://github.com/lucasols/utils/blob/main/packages/utils/src/diffParser.ts#L50)

###### Inherited from

[`DiffFileBase`](#difffilebase).[`from`](#from)

##### index

```ts
index: undefined | string[];
```

Defined in: [packages/utils/src/diffParser.ts:54](https://github.com/lucasols/utils/blob/main/packages/utils/src/diffParser.ts#L54)

###### Inherited from

[`DiffFileBase`](#difffilebase).[`index`](#index)

##### newMode

```ts
newMode: undefined | string;
```

Defined in: [packages/utils/src/diffParser.ts:53](https://github.com/lucasols/utils/blob/main/packages/utils/src/diffParser.ts#L53)

###### Inherited from

[`DiffFileBase`](#difffilebase).[`newMode`](#newmode)

##### oldMode

```ts
oldMode: undefined | string;
```

Defined in: [packages/utils/src/diffParser.ts:52](https://github.com/lucasols/utils/blob/main/packages/utils/src/diffParser.ts#L52)

###### Inherited from

[`DiffFileBase`](#difffilebase).[`oldMode`](#oldmode)

##### rawDiff

```ts
rawDiff: string;
```

Defined in: [packages/utils/src/diffParser.ts:56](https://github.com/lucasols/utils/blob/main/packages/utils/src/diffParser.ts#L56)

###### Inherited from

[`DiffFileBase`](#difffilebase).[`rawDiff`](#rawdiff)

##### to

```ts
to: undefined | string;
```

Defined in: [packages/utils/src/diffParser.ts:51](https://github.com/lucasols/utils/blob/main/packages/utils/src/diffParser.ts#L51)

###### Inherited from

[`DiffFileBase`](#difffilebase).[`to`](#to)

##### type

```ts
type: "modified";
```

Defined in: [packages/utils/src/diffParser.ts:60](https://github.com/lucasols/utils/blob/main/packages/utils/src/diffParser.ts#L60)

###### Overrides

[`DiffFileBase`](#difffilebase).[`type`](#type-1)

***

### DiffFileNew

Defined in: [packages/utils/src/diffParser.ts:63](https://github.com/lucasols/utils/blob/main/packages/utils/src/diffParser.ts#L63)

#### Extends

- [`DiffFileBase`](#difffilebase)

#### Properties

##### additions

```ts
additions: number;
```

Defined in: [packages/utils/src/diffParser.ts:49](https://github.com/lucasols/utils/blob/main/packages/utils/src/diffParser.ts#L49)

###### Inherited from

[`DiffFileBase`](#difffilebase).[`additions`](#additions)

##### chunks

```ts
chunks: Chunk[];
```

Defined in: [packages/utils/src/diffParser.ts:47](https://github.com/lucasols/utils/blob/main/packages/utils/src/diffParser.ts#L47)

###### Inherited from

[`DiffFileBase`](#difffilebase).[`chunks`](#chunks)

##### deletions

```ts
deletions: number;
```

Defined in: [packages/utils/src/diffParser.ts:48](https://github.com/lucasols/utils/blob/main/packages/utils/src/diffParser.ts#L48)

###### Inherited from

[`DiffFileBase`](#difffilebase).[`deletions`](#deletions)

##### diff

```ts
diff: undefined | string;
```

Defined in: [packages/utils/src/diffParser.ts:55](https://github.com/lucasols/utils/blob/main/packages/utils/src/diffParser.ts#L55)

###### Inherited from

[`DiffFileBase`](#difffilebase).[`diff`](#diff)

##### from

```ts
from: undefined | string;
```

Defined in: [packages/utils/src/diffParser.ts:50](https://github.com/lucasols/utils/blob/main/packages/utils/src/diffParser.ts#L50)

###### Inherited from

[`DiffFileBase`](#difffilebase).[`from`](#from)

##### index

```ts
index: undefined | string[];
```

Defined in: [packages/utils/src/diffParser.ts:54](https://github.com/lucasols/utils/blob/main/packages/utils/src/diffParser.ts#L54)

###### Inherited from

[`DiffFileBase`](#difffilebase).[`index`](#index)

##### newMode

```ts
newMode: undefined | string;
```

Defined in: [packages/utils/src/diffParser.ts:53](https://github.com/lucasols/utils/blob/main/packages/utils/src/diffParser.ts#L53)

###### Inherited from

[`DiffFileBase`](#difffilebase).[`newMode`](#newmode)

##### oldMode

```ts
oldMode: undefined | string;
```

Defined in: [packages/utils/src/diffParser.ts:52](https://github.com/lucasols/utils/blob/main/packages/utils/src/diffParser.ts#L52)

###### Inherited from

[`DiffFileBase`](#difffilebase).[`oldMode`](#oldmode)

##### rawDiff

```ts
rawDiff: string;
```

Defined in: [packages/utils/src/diffParser.ts:56](https://github.com/lucasols/utils/blob/main/packages/utils/src/diffParser.ts#L56)

###### Inherited from

[`DiffFileBase`](#difffilebase).[`rawDiff`](#rawdiff)

##### to

```ts
to: undefined | string;
```

Defined in: [packages/utils/src/diffParser.ts:51](https://github.com/lucasols/utils/blob/main/packages/utils/src/diffParser.ts#L51)

###### Inherited from

[`DiffFileBase`](#difffilebase).[`to`](#to)

##### type

```ts
type: "new";
```

Defined in: [packages/utils/src/diffParser.ts:64](https://github.com/lucasols/utils/blob/main/packages/utils/src/diffParser.ts#L64)

###### Overrides

[`DiffFileBase`](#difffilebase).[`type`](#type-1)

***

### DiffFileRenamed

Defined in: [packages/utils/src/diffParser.ts:71](https://github.com/lucasols/utils/blob/main/packages/utils/src/diffParser.ts#L71)

#### Extends

- [`DiffFileBase`](#difffilebase)

#### Properties

##### additions

```ts
additions: number;
```

Defined in: [packages/utils/src/diffParser.ts:49](https://github.com/lucasols/utils/blob/main/packages/utils/src/diffParser.ts#L49)

###### Inherited from

[`DiffFileBase`](#difffilebase).[`additions`](#additions)

##### chunks

```ts
chunks: Chunk[];
```

Defined in: [packages/utils/src/diffParser.ts:47](https://github.com/lucasols/utils/blob/main/packages/utils/src/diffParser.ts#L47)

###### Inherited from

[`DiffFileBase`](#difffilebase).[`chunks`](#chunks)

##### deletions

```ts
deletions: number;
```

Defined in: [packages/utils/src/diffParser.ts:48](https://github.com/lucasols/utils/blob/main/packages/utils/src/diffParser.ts#L48)

###### Inherited from

[`DiffFileBase`](#difffilebase).[`deletions`](#deletions)

##### diff

```ts
diff: undefined | string;
```

Defined in: [packages/utils/src/diffParser.ts:55](https://github.com/lucasols/utils/blob/main/packages/utils/src/diffParser.ts#L55)

###### Inherited from

[`DiffFileBase`](#difffilebase).[`diff`](#diff)

##### from

```ts
from: undefined | string;
```

Defined in: [packages/utils/src/diffParser.ts:50](https://github.com/lucasols/utils/blob/main/packages/utils/src/diffParser.ts#L50)

###### Inherited from

[`DiffFileBase`](#difffilebase).[`from`](#from)

##### index

```ts
index: undefined | string[];
```

Defined in: [packages/utils/src/diffParser.ts:54](https://github.com/lucasols/utils/blob/main/packages/utils/src/diffParser.ts#L54)

###### Inherited from

[`DiffFileBase`](#difffilebase).[`index`](#index)

##### newMode

```ts
newMode: undefined | string;
```

Defined in: [packages/utils/src/diffParser.ts:53](https://github.com/lucasols/utils/blob/main/packages/utils/src/diffParser.ts#L53)

###### Inherited from

[`DiffFileBase`](#difffilebase).[`newMode`](#newmode)

##### oldMode

```ts
oldMode: undefined | string;
```

Defined in: [packages/utils/src/diffParser.ts:52](https://github.com/lucasols/utils/blob/main/packages/utils/src/diffParser.ts#L52)

###### Inherited from

[`DiffFileBase`](#difffilebase).[`oldMode`](#oldmode)

##### rawDiff

```ts
rawDiff: string;
```

Defined in: [packages/utils/src/diffParser.ts:56](https://github.com/lucasols/utils/blob/main/packages/utils/src/diffParser.ts#L56)

###### Inherited from

[`DiffFileBase`](#difffilebase).[`rawDiff`](#rawdiff)

##### similarityIndex

```ts
similarityIndex: undefined | number;
```

Defined in: [packages/utils/src/diffParser.ts:73](https://github.com/lucasols/utils/blob/main/packages/utils/src/diffParser.ts#L73)

##### to

```ts
to: undefined | string;
```

Defined in: [packages/utils/src/diffParser.ts:51](https://github.com/lucasols/utils/blob/main/packages/utils/src/diffParser.ts#L51)

###### Inherited from

[`DiffFileBase`](#difffilebase).[`to`](#to)

##### type

```ts
type: "renamed";
```

Defined in: [packages/utils/src/diffParser.ts:72](https://github.com/lucasols/utils/blob/main/packages/utils/src/diffParser.ts#L72)

###### Overrides

[`DiffFileBase`](#difffilebase).[`type`](#type-1)

***

### ParentRange

Defined in: [packages/utils/src/diffParser.ts:12](https://github.com/lucasols/utils/blob/main/packages/utils/src/diffParser.ts#L12)

#### Properties

##### lines

```ts
lines: number;
```

Defined in: [packages/utils/src/diffParser.ts:14](https://github.com/lucasols/utils/blob/main/packages/utils/src/diffParser.ts#L14)

##### start

```ts
start: number;
```

Defined in: [packages/utils/src/diffParser.ts:13](https://github.com/lucasols/utils/blob/main/packages/utils/src/diffParser.ts#L13)

## Type Aliases

### DiffFileType

```ts
type DiffFileType = "modified" | "new" | "deleted" | "renamed" | "binary" | "combined";
```

Defined in: [packages/utils/src/diffParser.ts:37](https://github.com/lucasols/utils/blob/main/packages/utils/src/diffParser.ts#L37)
