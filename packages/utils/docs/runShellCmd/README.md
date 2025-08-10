[**@ls-stack/utils**](../README.md)

***

[@ls-stack/utils](../modules.md) / runShellCmd

# runShellCmd

## Modules

- [\<internal\>](-internal-.md)

## Functions

### ~~concurrentCmd()~~

```ts
function concurrentCmd(
   label, 
   cmd, 
onResult): Promise<() => void>;
```

Defined in: [packages/utils/src/runShellCmd.ts:133](https://github.com/lucasols/utils/blob/main/packages/utils/src/runShellCmd.ts#L133)

#### Parameters

##### label

`string`

##### cmd

`string` | `string`[]

##### onResult

(`result`) => `void`

#### Returns

`Promise`\<() => `void`\>

#### Deprecated

This utility has been moved to @ls-stack/node-utils. Please update your imports:
```
// Old (deprecated)
import { concurrentCmd } from '@ls-stack/utils/runShellCmd';

// New (preferred)
import { concurrentCmd } from '@ls-stack/node-utils/runShellCmd';
```

***

### ~~runCmd()~~

```ts
function runCmd(
   label, 
   command, 
root0): Promise<CmdResult>;
```

Defined in: [packages/utils/src/runShellCmd.ts:39](https://github.com/lucasols/utils/blob/main/packages/utils/src/runShellCmd.ts#L39)

#### Parameters

##### label

`null` | `string`

##### command

`string` | `string`[]

##### root0

[`RunCmdOptions`](-internal-.md#runcmdoptions) = `{}`

#### Returns

`Promise`\<[`CmdResult`](-internal-.md#cmdresult)\>

#### Deprecated

This utility has been moved to @ls-stack/node-utils. Please update your imports:
```
// Old (deprecated)
import { runCmd } from '@ls-stack/utils/runShellCmd';

// New (preferred)
import { runCmd } from '@ls-stack/node-utils/runShellCmd';
```

***

### ~~runCmdSilent()~~

```ts
function runCmdSilent(command): Promise<CmdResult>;
```

Defined in: [packages/utils/src/runShellCmd.ts:198](https://github.com/lucasols/utils/blob/main/packages/utils/src/runShellCmd.ts#L198)

#### Parameters

##### command

`string` | `string`[]

#### Returns

`Promise`\<[`CmdResult`](-internal-.md#cmdresult)\>

#### Deprecated

This utility has been moved to @ls-stack/node-utils. Please update your imports:
```
// Old (deprecated)
import { runCmdSilent } from '@ls-stack/utils/runShellCmd';

// New (preferred)
import { runCmdSilent } from '@ls-stack/node-utils/runShellCmd';
```

***

### ~~runCmdSilentUnwrap()~~

```ts
function runCmdSilentUnwrap(command): Promise<string>;
```

Defined in: [packages/utils/src/runShellCmd.ts:213](https://github.com/lucasols/utils/blob/main/packages/utils/src/runShellCmd.ts#L213)

#### Parameters

##### command

`string` | `string`[]

#### Returns

`Promise`\<`string`\>

#### Deprecated

This utility has been moved to @ls-stack/node-utils. Please update your imports:
```
// Old (deprecated)
import { runCmdSilentUnwrap } from '@ls-stack/utils/runShellCmd';

// New (preferred)
import { runCmdSilentUnwrap } from '@ls-stack/node-utils/runShellCmd';
```

***

### ~~runCmdUnwrap()~~

```ts
function runCmdUnwrap(
   label, 
   command, 
root0): Promise<string>;
```

Defined in: [packages/utils/src/runShellCmd.ts:175](https://github.com/lucasols/utils/blob/main/packages/utils/src/runShellCmd.ts#L175)

#### Parameters

##### label

`null` | `string`

##### command

`string` | `string`[]

##### root0

###### silent?

`boolean` \| `"timeOnly"`

#### Returns

`Promise`\<`string`\>

#### Deprecated

This utility has been moved to @ls-stack/node-utils. Please update your imports:
```
// Old (deprecated)
import { runCmdUnwrap } from '@ls-stack/utils/runShellCmd';

// New (preferred)
import { runCmdUnwrap } from '@ls-stack/node-utils/runShellCmd';
```
