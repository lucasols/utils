[**@ls-stack/node-utils**](../README.md)

***

[@ls-stack/node-utils](../modules.md) / runShellCmd

# runShellCmd

## Modules

- [\<internal\>](-internal-.md)

## Functions

### concurrentCmd()

```ts
function concurrentCmd(
   label, 
   cmd, 
onResult): Promise<() => void>;
```

Defined in: [runShellCmd.ts:102](https://github.com/lucasols/utils/blob/main/packages/node-utils/src/runShellCmd.ts#L102)

#### Parameters

##### label

`string`

##### cmd

`string` | `string`[]

##### onResult

(`result`) => `void`

#### Returns

`Promise`\<() => `void`\>

***

### runCmd()

```ts
function runCmd(
   label, 
   command, 
__namedParameters): Promise<CmdResult>;
```

Defined in: [runShellCmd.ts:21](https://github.com/lucasols/utils/blob/main/packages/node-utils/src/runShellCmd.ts#L21)

#### Parameters

##### label

`null` | `string`

##### command

`string` | `string`[]

##### \_\_namedParameters

[`RunCmdOptions`](-internal-.md#runcmdoptions) = `{}`

#### Returns

`Promise`\<[`CmdResult`](-internal-.md#cmdresult)\>

***

### runCmdSilent()

```ts
function runCmdSilent(command): Promise<CmdResult>;
```

Defined in: [runShellCmd.ts:145](https://github.com/lucasols/utils/blob/main/packages/node-utils/src/runShellCmd.ts#L145)

#### Parameters

##### command

`string` | `string`[]

#### Returns

`Promise`\<[`CmdResult`](-internal-.md#cmdresult)\>

***

### runCmdSilentUnwrap()

```ts
function runCmdSilentUnwrap(command): Promise<string>;
```

Defined in: [runShellCmd.ts:149](https://github.com/lucasols/utils/blob/main/packages/node-utils/src/runShellCmd.ts#L149)

#### Parameters

##### command

`string` | `string`[]

#### Returns

`Promise`\<`string`\>

***

### runCmdUnwrap()

```ts
function runCmdUnwrap(
   label, 
   command, 
__namedParameters): Promise<string>;
```

Defined in: [runShellCmd.ts:130](https://github.com/lucasols/utils/blob/main/packages/node-utils/src/runShellCmd.ts#L130)

#### Parameters

##### label

`null` | `string`

##### command

`string` | `string`[]

##### \_\_namedParameters

###### cwd?

`string`

###### silent?

`boolean` \| `"timeOnly"`

#### Returns

`Promise`\<`string`\>
