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

Defined in: [runShellCmd.ts:124](https://github.com/lucasols/utils/blob/main/packages/node-utils/src/runShellCmd.ts#L124)

Runs a command concurrently with logging and error handling.

#### Parameters

##### label

`string`

Label for the command

##### cmd

The command to run

`string` | `string`[]

##### onResult

(`result`) => `void`

Callback function to handle the result

#### Returns

`Promise`\<() => `void`\>

Function to display errors if any occurred

***

### runCmd()

```ts
function runCmd(
   label, 
   command, 
options): Promise<CmdResult>;
```

Defined in: [runShellCmd.ts:35](https://github.com/lucasols/utils/blob/main/packages/node-utils/src/runShellCmd.ts#L35)

Runs a shell command and returns the result.

#### Parameters

##### label

Optional label for the command (used for logging)

`null` | `string`

##### command

The command to run (string or array of strings)

`string` | `string`[]

##### options

[`RunCmdOptions`](-internal-.md#runcmdoptions) = `{}`

Configuration options

#### Returns

`Promise`\<[`CmdResult`](-internal-.md#cmdresult)\>

Promise that resolves to the command result

***

### runCmdSilent()

```ts
function runCmdSilent(command): Promise<CmdResult>;
```

Defined in: [runShellCmd.ts:183](https://github.com/lucasols/utils/blob/main/packages/node-utils/src/runShellCmd.ts#L183)

Runs a command silently without any output.

#### Parameters

##### command

The command to run

`string` | `string`[]

#### Returns

`Promise`\<[`CmdResult`](-internal-.md#cmdresult)\>

Promise that resolves to the command result

***

### runCmdSilentUnwrap()

```ts
function runCmdSilentUnwrap(command): Promise<string>;
```

Defined in: [runShellCmd.ts:193](https://github.com/lucasols/utils/blob/main/packages/node-utils/src/runShellCmd.ts#L193)

Runs a command silently and returns only the stdout.

#### Parameters

##### command

The command to run

`string` | `string`[]

#### Returns

`Promise`\<`string`\>

Promise that resolves to the stdout string

***

### runCmdUnwrap()

```ts
function runCmdUnwrap(
   label, 
   command, 
options): Promise<string>;
```

Defined in: [runShellCmd.ts:162](https://github.com/lucasols/utils/blob/main/packages/node-utils/src/runShellCmd.ts#L162)

Runs a command and returns only the stdout, throwing on error.

#### Parameters

##### label

Optional label for the command

`null` | `string`

##### command

The command to run

`string` | `string`[]

##### options

Configuration options

###### cwd?

`string`

Working directory for the command

###### silent?

`boolean` \| `"timeOnly"`

Whether to suppress output

#### Returns

`Promise`\<`string`\>

Promise that resolves to the stdout string
