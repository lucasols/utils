[**@ls-stack/browser-utils**](../README.md)

***

[@ls-stack/browser-utils](../modules.md) / domEvents

# domEvents

## Modules

- [\<internal\>](-internal-.md)

## Functions

### createDocumentEvtListener()

```ts
function createDocumentEvtListener<K>(
   type, 
   listener, 
   options?): RemoveListenerFn;
```

Defined in: [domEvents.ts:3](https://github.com/lucasols/utils/blob/main/packages/browser-utils/src/domEvents.ts#L3)

#### Type Parameters

##### K

`K` *extends* keyof `DocumentEventMap`

#### Parameters

##### type

`K`

##### listener

(`e`) => `void`

##### options?

`AddEventListenerOptions`

#### Returns

[`RemoveListenerFn`](-internal-.md#removelistenerfn)

***

### createElementEvtListener()

```ts
function createElementEvtListener<K>(
   element, 
   type, 
   listener, 
   options?): RemoveListenerFn;
```

Defined in: [domEvents.ts:17](https://github.com/lucasols/utils/blob/main/packages/browser-utils/src/domEvents.ts#L17)

#### Type Parameters

##### K

`K` *extends* keyof `HTMLElementEventMap`

#### Parameters

##### element

`HTMLElement`

##### type

`K`

##### listener

(`e`) => `void`

##### options?

`AddEventListenerOptions`

#### Returns

[`RemoveListenerFn`](-internal-.md#removelistenerfn)

***

### createWindowEvtListener()

```ts
function createWindowEvtListener<K>(
   type, 
   listener, 
   options?): RemoveListenerFn;
```

Defined in: [domEvents.ts:32](https://github.com/lucasols/utils/blob/main/packages/browser-utils/src/domEvents.ts#L32)

#### Type Parameters

##### K

`K` *extends* keyof `WindowEventMap`

#### Parameters

##### type

`K`

##### listener

(`e`) => `void`

##### options?

`AddEventListenerOptions`

#### Returns

[`RemoveListenerFn`](-internal-.md#removelistenerfn)

***

### onElementTransitionsEnd()

```ts
function onElementTransitionsEnd(element, cb): Promise<void>;
```

Defined in: [domEvents.ts:46](https://github.com/lucasols/utils/blob/main/packages/browser-utils/src/domEvents.ts#L46)

#### Parameters

##### element

`HTMLElement`

##### cb

() => `void`

#### Returns

`Promise`\<`void`\>
