/* eslint-disable no-fallthrough */
// copied from `@emotion/hash`

/**
 * @param str - The string to hash.
 * @returns The hash of the string.
 */
export function murmur2(str: string) {
  // 'm' and 'r' are mixing constants generated offline.
  // They're not really 'magic', they just happen to work well.

  // const m = 0x5bd1e995;
  // const r = 24;

  // Initialize the hash

  let h = 0;

  // Mix 4 bytes at a time into the hash

  let k,
    i = 0,
    len = str.length;
  for (; len >= 4; ++i, len -= 4) {
    k =
      (str.charCodeAt(i) & 0xff) |
      ((str.charCodeAt(++i) & 0xff) << 8) |
      ((str.charCodeAt(++i) & 0xff) << 16) |
      ((str.charCodeAt(++i) & 0xff) << 24);

    k =
      /* Math.imul(k, m): */
      (k & 0xffff) * 0x5bd1e995 + (((k >>> 16) * 0xe995) << 16);
    k ^= /* k >>> r: */ k >>> 24;

    h =
      /* Math.imul(k, m): */
      ((k & 0xffff) * 0x5bd1e995 + (((k >>> 16) * 0xe995) << 16)) ^
      /* Math.imul(h, m): */
      ((h & 0xffff) * 0x5bd1e995 + (((h >>> 16) * 0xe995) << 16));
  }

  // Handle the last few bytes of the input array

  switch (len) {
    case 3:
      h ^= (str.charCodeAt(i + 2) & 0xff) << 16;
    case 2:
      h ^= (str.charCodeAt(i + 1) & 0xff) << 8;
    case 1:
      h ^= str.charCodeAt(i) & 0xff;
      h =
        /* Math.imul(h, m): */
        (h & 0xffff) * 0x5bd1e995 + (((h >>> 16) * 0xe995) << 16);
  }

  // Do a few final mixes of the hash to ensure the last few
  // bytes are well-incorporated.

  h ^= h >>> 13;
  h =
    /* Math.imul(h, m): */
    (h & 0xffff) * 0x5bd1e995 + (((h >>> 16) * 0xe995) << 16);

  return ((h ^ (h >>> 15)) >>> 0).toString(36);
}

/**
 * Hashes a string with the MurmurHash3 x86 32-bit algorithm and returns a
 * base-36 string.
 *
 * @param str - The string to hash.
 * @returns The hash of the string in base-36 format.
 */
export function murmur3(str: string): string;
/**
 * Hashes a string with the MurmurHash3 x86 32-bit algorithm and returns a
 * base-36 string.
 *
 * @param str - The string to hash.
 * @param output - The output format.
 * @returns The hash of the string in base-36 format.
 */
export function murmur3(str: string, output: 'base36'): string;
/**
 * Hashes a string with the MurmurHash3 x86 32-bit algorithm and returns an
 * unsigned 32-bit integer.
 *
 * @param str - The string to hash.
 * @param output - The output format.
 * @returns The hash of the string as an unsigned 32-bit integer.
 */
export function murmur3(str: string, output: 'uint32'): number;
/**
 * Hashes a string with the MurmurHash3 x86 32-bit algorithm.
 *
 * @param str - The string to hash.
 * @param output - The output format. Defaults to `'base36'`.
 * @returns The hash of the string.
 */
export function murmur3(str: string, output: 'base36' | 'uint32' = 'base36') {
  let h1 = 0;
  let i = 0;
  const remaining = str.length & 3;
  const bytes = str.length - remaining;

  while (i < bytes) {
    const top = str.charCodeAt(i + 3);
    let k1 =
      (str.charCodeAt(i) & 0xffff) ^
      ((str.charCodeAt(i + 1) & 0xffff) << 8) ^
      ((str.charCodeAt(i + 2) & 0xffff) << 16) ^
      ((top & 0xff) << 24) ^
      ((top & 0xff00) >> 8);
    i += 4;

    k1 = Math.imul(k1, 0xcc9e2d51);
    k1 = (k1 << 15) | (k1 >>> 17);
    k1 = Math.imul(k1, 0x1b873593);

    h1 ^= k1;
    h1 = (h1 << 13) | (h1 >>> 19);
    h1 = (Math.imul(h1, 5) + 0xe6546b64) | 0;
  }

  let k1 = 0;
  switch (remaining) {
    case 3:
      k1 ^= (str.charCodeAt(i + 2) & 0xffff) << 16;
    case 2:
      k1 ^= (str.charCodeAt(i + 1) & 0xffff) << 8;
    case 1:
      k1 ^= str.charCodeAt(i) & 0xffff;
      k1 = Math.imul(k1, 0xcc9e2d51);
      k1 = (k1 << 15) | (k1 >>> 17);
      k1 = Math.imul(k1, 0x1b873593);
      h1 ^= k1;
  }

  h1 ^= str.length;
  h1 ^= h1 >>> 16;
  h1 = Math.imul(h1, 0x85ebca6b);
  h1 ^= h1 >>> 13;
  h1 = Math.imul(h1, 0xc2b2ae35);
  h1 ^= h1 >>> 16;

  const hash = h1 >>> 0;
  return output === 'uint32' ? hash : hash.toString(36);
}
