/** @deprecated Use `PartialRecord` from `@ls-stack/utils/typeUtils` instead */
export type PartialRecord<K extends keyof any, T> = {
  [P in K]?: T;
};

/** @deprecated Use `NonPartial` from `@ls-stack/utils/typeUtils` instead */
export type NonPartial<T> = { [K in keyof Required<T>]: T[K] };

/** @deprecated Use `ObjKeysWithValuesOfType` from `@ls-stack/utils/typeUtils` instead */
export type ObjKeysWithValuesOfType<
  Obj extends Record<PropertyKey, unknown>,
  ValueType,
> = {
  [K in keyof Obj]: Obj[K] extends ValueType ? K : never;
}[keyof Obj];

/** @deprecated Use `IsAny` from `@ls-stack/utils/typeUtils` instead */
export type IsAny<T> =
  unknown extends T ?
    [keyof T] extends [never] ?
      false
    : true
  : false;

/** @deprecated Use `DeepPrettify` from `@ls-stack/utils/typeUtils` instead */
export type Prettify<T extends Record<string, unknown>> = {
  [P in keyof T]: T[P];
} & {};

/** @deprecated Use `DeepPrettify` from `@ls-stack/utils/typeUtils` instead */
export type DeepPrettify<T> = {
  [K in keyof T]: T[K] extends Record<string, unknown> ? DeepPrettify<T[K]>
  : T[K];
} & {};
