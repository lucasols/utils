export type NoInfer<T> = [T][T extends any ? 0 : never];

export type PartialRecord<K extends keyof any, T> = {
  [P in K]?: T;
};

export type NonPartial<T> = { [K in keyof Required<T>]: T[K] };

export type KeysType = keyof any;

export type ObjKeysWithValuesOfType<
  Obj extends Record<KeysType, unknown>,
  ValueType,
> = {
  [K in keyof Obj]: Obj[K] extends ValueType ? K : never;
}[keyof Obj];
