/**
 * Type guard to check if a value is a plain object (not null, not an array).
 *
 * Returns true if the value is an object that is not null and not an array.
 * This is useful for distinguishing between objects and other types.
 *
 * @param value - The value to check
 * @returns True if the value is a plain object, false otherwise
 *
 * @example
 * ```typescript
 * if (isObject(value)) {
 *   // TypeScript knows value is Record<string, unknown>
 *   console.log(value.someProperty);
 * }
 *
 * isObject({});           // true
 * isObject({ a: 1 });     // true
 * isObject(null);         // false
 * isObject([]);           // false
 * isObject('string');     // false
 * ```
 */
export function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

/**
 * Type guard to check if a value is a function.
 *
 * Returns true if the value is a function of any kind (regular function,
 * arrow function, method, constructor, etc.).
 *
 * @param value - The value to check
 * @returns True if the value is a function, false otherwise
 *
 * @example
 * ```typescript
 * if (isFunction(value)) {
 *   // TypeScript knows value is (...args: any[]) => any
 *   const result = value();
 * }
 *
 * isFunction(() => {});           // true
 * isFunction(function() {});      // true
 * isFunction(Math.max);           // true
 * isFunction('string');           // false
 * isFunction({});                 // false
 * ```
 */
export function isFunction(value: unknown): value is (...args: any[]) => any {
  return typeof value === 'function';
}

/**
 * Type guard to check if a value is a Promise or thenable object.
 *
 * Returns true if the value is an object with a `then` method that is a function.
 * This covers both native Promises and thenable objects that implement the
 * Promise interface.
 *
 * @param value - The value to check
 * @returns True if the value is a Promise or thenable, false otherwise
 *
 * @example
 * ```typescript
 * if (isPromise(value)) {
 *   // TypeScript knows value is Promise<unknown>
 *   const result = await value;
 * }
 *
 * isPromise(Promise.resolve());           // true
 * isPromise(new Promise(() => {}));       // true
 * isPromise({ then: () => {} });          // true
 * isPromise({ then: 'not a function' });  // false
 * isPromise('string');                    // false
 * ```
 */
export function isPromise(value: unknown): value is Promise<unknown> {
  return isObject(value) && 'then' in value && isFunction(value.then);
}

/**
 * Type guard to check if a value is a plain object (created by Object literal or Object constructor).
 *
 * Returns true if the value is a plain object - an object created by the Object
 * constructor or object literal syntax. This excludes instances of classes,
 * built-in objects like Date, RegExp, etc.
 *
 * @param value - The value to check
 * @returns True if the value is a plain object, false otherwise
 *
 * @example
 * ```typescript
 * if (isPlainObject(value)) {
 *   // TypeScript knows value is Record<string, unknown>
 *   console.log(Object.keys(value));
 * }
 *
 * isPlainObject({});                    // true
 * isPlainObject({ a: 1 });              // true
 * isPlainObject(Object.create(null));   // true
 * isPlainObject(new Date());            // false
 * isPlainObject(/regex/);               // false
 * isPlainObject(new MyClass());         // false
 * isPlainObject([]);                    // false
 * ```
 */
export function isPlainObject(value: any): value is Record<string, unknown> {
  if (!value || typeof value !== 'object') return false;
  const proto = Object.getPrototypeOf(value);
  if (proto === null) {
    return true;
  }
  const Ctor =
    Object.hasOwnProperty.call(proto, 'constructor') && proto.constructor;

  if (Ctor === Object) return true;

  const objectCtorString = Object.prototype.constructor.toString();

  return (
    typeof Ctor == 'function' &&
    Function.toString.call(Ctor) === objectCtorString
  );
}
