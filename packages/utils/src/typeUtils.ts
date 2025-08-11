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

export type DefaultSkipTransverseDeepReplace =
  | Date
  | RegExp
  | ((...args: any[]) => any)
  | Error
  | Set<any>
  | Map<any, any>
  | WeakSet<any>
  | WeakMap<any, any>;

type PathMatches<CurrentPath extends string, SkipPaths extends string> =
  true extends (
    SkipPaths extends any ?
      CurrentPath extends SkipPaths ? true
      : SkipPaths extends `${infer Prefix}[*]${infer Suffix}` ?
        CurrentPath extends `${Prefix}[${string}]${Suffix}` ?
          true
        : false
      : false
    : false
  ) ?
    true
  : false;

type BuildPath<BasePath extends string, Key extends PropertyKey> =
  BasePath extends '$' ?
    Key extends string | number ?
      `${Key}`
    : never
  : Key extends string | number ? `${BasePath}.${Key}`
  : never;

type BuildArrayPath<BasePath extends string> =
  BasePath extends '$' ? '[*]' : `${BasePath}[*]`;

type DeepReplaceValueImpl<
  T,
  ReplaceType,
  NewType,
  SkipPaths extends string | undefined,
  SkipType,
  Path extends string = '$',
> =
  SkipPaths extends string ?
    PathMatches<Path, SkipPaths> extends true ? T
    : T extends ReplaceType ?
      T extends SkipType ?
        T
      : NewType
    : T extends readonly (infer U)[] ?
      Array<
        DeepReplaceValueImpl<
          U,
          ReplaceType,
          NewType,
          SkipPaths,
          SkipType,
          BuildArrayPath<Path>
        >
      >
    : T extends SkipType ? T
    : T extends Record<string, any> ?
      {
        [K in keyof T]: DeepReplaceValueImpl<
          T[K],
          ReplaceType,
          NewType,
          SkipPaths,
          SkipType,
          BuildPath<Path, K>
        >;
      }
    : T
  : T extends ReplaceType ?
    T extends SkipType ?
      T
    : NewType
  : T extends readonly (infer U)[] ?
    Array<
      DeepReplaceValueImpl<
        U,
        ReplaceType,
        NewType,
        SkipPaths,
        SkipType,
        BuildArrayPath<Path>
      >
    >
  : T extends SkipType ? T
  : T extends Record<string, any> ?
    {
      [K in keyof T]: DeepReplaceValueImpl<
        T[K],
        ReplaceType,
        NewType,
        SkipPaths,
        SkipType,
        BuildPath<Path, K>
      >;
    }
  : T;

/**
 * Replaces all values that extends `ReplaceType` with `NewType` in a deeply nested object or array.
 *
 * @template T - The object or array to replace values in.
 * @template ReplaceType - The type to replace.
 * @template NewType - The new type to replace with.
 * @template SkipPaths - The paths to skip in transverse. e.g. 'a.b.c' | 'array[*].b'
 * @template SkipTypes - The types to skip in transverse and replace.
 */
export type DeepReplaceValue<
  T,
  ReplaceType,
  NewType,
  SkipPaths extends string | undefined = undefined,
  SkipTypes = DefaultSkipTransverseDeepReplace,
> = DeepReplaceValueImpl<T, ReplaceType, NewType, SkipPaths, SkipTypes>;
