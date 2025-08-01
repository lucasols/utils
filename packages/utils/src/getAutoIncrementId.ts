let id = 1;

/**
 * Returns a unique auto-incrementing number each time it's called.
 * This is useful for generating simple unique identifiers within a single session/process.
 *
 * **Note:** This is not suitable for distributed systems or persistent storage.
 * For cryptographically secure or collision-resistant IDs, use `nanoid()` instead.
 *
 * @returns A unique incrementing number starting from 1
 *
 * @example
 * ```ts
 * const id1 = getAutoIncrementId(); // 1
 * const id2 = getAutoIncrementId(); // 2
 * const id3 = getAutoIncrementId(); // 3
 * ```
 */
export function getAutoIncrementId(): number {
  return id++;
}

/**
 * Creates a local auto-increment ID generator with optional prefix and suffix.
 * Each generator maintains its own independent counter starting from 1.
 * This is useful when you need multiple independent ID sequences or formatted IDs.
 *
 * @param options - Configuration object
 * @param options.prefix - Optional prefix to prepend to each generated ID
 * @param options.suffix - Optional suffix to append to each generated ID
 * @returns A function that generates formatted auto-increment IDs
 *
 * @example
 * ```ts
 * const userIdGen = getLocalAutoIncrementIdGenerator({ prefix: 'user-' });
 * const postIdGen = getLocalAutoIncrementIdGenerator({ prefix: 'post-', suffix: '-draft' });
 *
 * console.log(userIdGen()); // "user-1"
 * console.log(userIdGen()); // "user-2"
 * console.log(postIdGen()); // "post-1-draft"
 * console.log(postIdGen()); // "post-2-draft"
 * ```
 */
export function getLocalAutoIncrementIdGenerator({
  prefix,
  suffix,
}: {
  prefix?: string;
  suffix?: string;
}): () => string {
  let localId = 1;

  return () => {
    return `${prefix || ''}${localId++}${suffix || ''}`;
  };
}
