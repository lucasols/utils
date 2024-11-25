/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-call */

/** forked from https://github.com/lukeed/dequal to consider invalid dates as equal */

const has = Object.prototype.hasOwnProperty;

function find(iter: any[], tar: any, maxDepth: number): any {
  for (const key of iter.keys()) {
    if (deepEqual(key, tar, maxDepth)) return key;
  }
}

export function deepEqual(foo: any, bar: any, maxDepth = 20): boolean {
  let ctor, len, tmp;
  if (foo === bar) return true;

  if (maxDepth && maxDepth <= 0) return false;

  if (foo && bar && (ctor = foo.constructor) === bar.constructor) {
    if (ctor === Date)
      return deepEqual(foo.getTime(), bar.getTime(), maxDepth - 1);
    if (ctor === RegExp) return foo.toString() === bar.toString();

    if (ctor === Array) {
      if ((len = foo.length) === bar.length) {
        while (len-- && deepEqual(foo[len], bar[len], maxDepth - 1));
      }
      return len === -1;
    }

    if (ctor === Set) {
      if (foo.size !== bar.size) {
        return false;
      }
      for (len of foo) {
        tmp = len;
        if (tmp && typeof tmp === 'object') {
          tmp = find(bar, tmp, maxDepth - 1);
          if (!tmp) return false;
        }
        if (!bar.has(tmp)) return false;
      }
      return true;
    }

    if (ctor === Map) {
      if (foo.size !== bar.size) {
        return false;
      }
      for (len of foo) {
        tmp = len[0];
        if (tmp && typeof tmp === 'object') {
          tmp = find(bar, tmp, maxDepth - 1);
          if (!tmp) return false;
        }
        if (!deepEqual(len[1], bar.get(tmp), maxDepth - 1)) {
          return false;
        }
      }
      return true;
    }

    if (!ctor || typeof foo === 'object') {
      len = 0;
      for (ctor in foo) {
        if (has.call(foo, ctor) && ++len && !has.call(bar, ctor)) return false;
        if (!(ctor in bar) || !deepEqual(foo[ctor], bar[ctor], maxDepth - 1))
          return false;
      }
      return Object.keys(bar).length === len;
    }
  }

  return foo !== foo && bar !== bar;
}
