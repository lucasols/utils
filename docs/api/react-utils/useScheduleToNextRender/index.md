[@ls-stack/react-utils](../modules.md) / useScheduleToNextRender

# useScheduleToNextRender

## Modules

- [\<internal\>](-internal-.md)

## Functions

### useScheduleToNextRender()

```ts
function useScheduleToNextRender(options?): (callback, key?) => void;
```

Defined in: [packages/react-utils/src/useScheduleToNextRender.ts:9](https://github.com/lucasols/utils/blob/main/packages/react-utils/src/useScheduleToNextRender.ts#L9)

Schedules a callback to be called on the next render.

#### Parameters

##### options?

[`UseScheduleToNextRenderOptions`](-internal-.md#usescheduletonextrenderoptions)

#### Returns

```ts
(callback, key?): void;
```

##### Parameters

###### callback

() => `void`

###### key?

`string`

##### Returns

`void`
