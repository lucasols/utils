[**@ls-stack/utils**](../README.md)

***

[@ls-stack/utils](../modules.md) / [createThrottleController](README.md) / \<internal\>

# \<internal\>

## Type Aliases

### Options

```ts
type Options = object;
```

Defined in: [src/createThrottleController.ts:5](https://github.com/lucasols/utils/blob/main/src/createThrottleController.ts#L5)

#### Properties

##### cleanupCheckSecsInterval?

```ts
optional cleanupCheckSecsInterval: number;
```

Defined in: [src/createThrottleController.ts:8](https://github.com/lucasols/utils/blob/main/src/createThrottleController.ts#L8)

##### maxCalls

```ts
maxCalls: number;
```

Defined in: [src/createThrottleController.ts:6](https://github.com/lucasols/utils/blob/main/src/createThrottleController.ts#L6)

##### per

```ts
per: DurationObj;
```

Defined in: [src/createThrottleController.ts:7](https://github.com/lucasols/utils/blob/main/src/createThrottleController.ts#L7)

***

### ThrottleController

```ts
type ThrottleController = object;
```

Defined in: [src/createThrottleController.ts:11](https://github.com/lucasols/utils/blob/main/src/createThrottleController.ts#L11)

#### Properties

##### shouldSkip()

```ts
shouldSkip: (callId?) => boolean;
```

Defined in: [src/createThrottleController.ts:12](https://github.com/lucasols/utils/blob/main/src/createThrottleController.ts#L12)

###### Parameters

###### callId?

`string` | `number` | (`string` \| `number`)[]

###### Returns

`boolean`
