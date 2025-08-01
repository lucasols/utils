export type PartialRecord<K extends keyof any, T> = {
  [P in K]?: T;
};

export type NonPartial<T> = { [K in keyof Required<T>]: T[K] };

export type ObjKeysWithValuesOfType<
  Obj extends Record<PropertyKey, unknown>,
  ValueType,
> = {
  [K in keyof Obj]: Obj[K] extends ValueType ? K : never;
}[keyof Obj];

export type IsAny<T> =
  unknown extends T ?
    [keyof T] extends [never] ?
      false
    : true
  : false;

export type Prettify<T extends Record<string, unknown>> = {
  [P in keyof T]: T[P];
} & {};

export type DeepPrettify<T> = {
  [K in keyof T]: T[K] extends Record<string, unknown> ? DeepPrettify<T[K]>
  : T[K];
} & {};
