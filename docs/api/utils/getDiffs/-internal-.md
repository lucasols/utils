[@ls-stack/utils](../modules.md) / [getDiffs](index.md) / \<internal\>

# \<internal\>

## Type Aliases

### ObjDiffsKeys

```ts
type ObjDiffsKeys = 
  | typeof addKeysName
  | typeof removeKeysName
  | typeof updateKeysName;
```

Defined in: [packages/utils/src/getDiffs.ts:20](https://github.com/lucasols/utils/blob/main/packages/utils/src/getDiffs.ts#L20)

## Variables

### addKeysName

```ts
const addKeysName: "++keys_added" = '++keys_added';
```

Defined in: [packages/utils/src/getDiffs.ts:16](https://github.com/lucasols/utils/blob/main/packages/utils/src/getDiffs.ts#L16)

***

### removeKeysName

```ts
const removeKeysName: "--keys_removed" = '--keys_removed';
```

Defined in: [packages/utils/src/getDiffs.ts:17](https://github.com/lucasols/utils/blob/main/packages/utils/src/getDiffs.ts#L17)

***

### updateKeysName

```ts
const updateKeysName: "~~keys_updated" = '~~keys_updated';
```

Defined in: [packages/utils/src/getDiffs.ts:18](https://github.com/lucasols/utils/blob/main/packages/utils/src/getDiffs.ts#L18)
