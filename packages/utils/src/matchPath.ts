/* eslint-disable no-param-reassign, @typescript-eslint/naming-convention -- forked file from react-router */

import { fastCache } from './cache';

// Recursive helper for finding path parameters in the absence of wildcards
type _PathParam<Path extends string> =
  // split path into individual path segments
  Path extends `${infer L}/${infer R}` ? _PathParam<L> | _PathParam<R>
  : // find params after `:`
  Path extends `:${infer Param}` ?
    Param extends `${infer Optional}?` ?
      Optional
    : Param
  : // otherwise, there aren't any params present
    never;

export type PathParam<Path extends string> =
  // check if path is just a wildcard
  Path extends '*' | '/*' ? '*'
  : // look for wildcard at the end of the path
  Path extends `${infer Rest}/*` ? '*' | _PathParam<Rest>
  : // look for params in the absence of wildcards
    _PathParam<Path>;

// Attempt to parse the given string segment. If it fails, then just return the
// plain string type as a default fallback. Otherwise, return the union of the
// parsed string literals that were referenced as dynamic segments in the route.
export type ParamParseKey<Segment extends string> =
  // if you could not find path params, fallback to `string`
  [PathParam<Segment>] extends [never] ? string : PathParam<Segment>;

/** A PathPattern is used to match on some portion of a URL pathname. */
export interface PathPattern<Path extends string = string> {
  /**
   * A string to match against a URL pathname. May contain `:id`-style segments
   * to indicate placeholders for dynamic parameters. May also end with `/*` to
   * indicate matching the rest of the URL pathname.
   */
  path: Path;
  /**
   * Should be `true` if the static portions of the `path` should be matched in
   * the same case.
   */
  caseSensitive?: boolean;
  /** Should be `true` if this pattern should match the entire URL pathname. */
  end?: boolean;
}

/** The parameters that were parsed from the URL path. */
export type Params<Key extends string = string> = {
  readonly [key in Key]: string | undefined;
};

export type PathMatchGlob = {
  matchPath: <K extends ParamParseKey<Path>, Path extends string>(
    pattern: PathPattern<Path> | Path,
  ) => PathMatch<K> | null;
  path: string;
};

/** A PathMatch contains info about how a PathPattern matched on a URL pathname. */
export interface PathMatch<ParamKey extends string = string> {
  /** The names and values of dynamic parameters in the URL. */
  params: Params<ParamKey>;
  /** The portion of the URL pathname that was matched. */
  pathname: string;
  /** The portion of the URL pathname that was matched before child routes. */
  pathnameBase: string;
  /** The pattern that was used to match. */
  pattern: PathPattern;

  glob: null | PathMatchGlob;
}

type Mutable<T> = { -readonly [P in keyof T]: T[P] };

/**
 * Performs pattern matching on a URL pathname and returns information about the
 * match.
 *
 * @see https://reactrouter.com/utils/match-path
 */
export function matchPath<
  ParamKey extends ParamParseKey<Path>,
  Path extends string,
>(
  pattern: PathPattern<Path> | Path,
  pathname: string,
): PathMatch<ParamKey> | null {
  if (typeof pattern === 'string') {
    pattern = { path: pattern, caseSensitive: false, end: true };
  }

  // Normalize pathname to ensure leading slash for consistency (but preserve empty strings)
  const normalizedPathname = pathname === '' ? '' : pathname.replace(/^\/*/, '/');

  const [matcher, compiledParams] = compilePath(
    pattern.path,
    pattern.caseSensitive,
    pattern.end,
  );

  const match = normalizedPathname.match(matcher);
  if (!match) return null;

  const matchedPathname = match[0];
  let pathnameBase = matchedPathname.replace(/(.)\/+$/, '$1');
  const captureGroups = match.slice(1);
  // eslint-disable-next-line unicorn/no-array-reduce
  const params: Params = compiledParams.reduce<Mutable<Params>>(
    (memo, { paramName, isOptional }, index) => {
      // We need to compute the pathnameBase here using the raw splat value
      // instead of using params["*"] later because it will be decoded then
      if (paramName === '*') {
        const splatValue = captureGroups[index] || '';
        pathnameBase = matchedPathname
          .slice(0, matchedPathname.length - splatValue.length)
          .replace(/(.)\/+$/, '$1');
      }

      const value = captureGroups[index];
      if (isOptional && !value) {
        memo[paramName] = undefined;
      } else {
        memo[paramName] = (value || '').replace(/%2F/g, '/');
      }
      return memo;
    },
    {},
  );

  const glob = params['*'];

  const globPath = glob && `/${glob}`;

  return {
    params,
    pathname: matchedPathname,
    pathnameBase,
    pattern,
    glob:
      globPath ?
        {
          matchPath: (subPattern) => matchPath(subPattern, globPath),
          path: globPath,
        }
      : null,
  };
}

function warning(condition: boolean, message: string): void {
  if (process.env.NODE_ENV === 'development' && !condition) {
    console.warn(message);
  }
}

type CompiledPathParam = { paramName: string; isOptional?: boolean };

const cache = fastCache<[RegExp, CompiledPathParam[]]>({ maxCacheSize: 5_000 });

function compilePath(
  path: string,
  caseSensitive = false,
  end = true,
): [RegExp, CompiledPathParam[]] {
  return cache.getOrInsert(
    `${path}-${caseSensitive ? 's' : 'i'}${end ? 'e' : ''}`,
    () => {
      warning(
        path === '*' || !path.endsWith('*') || path.endsWith('/*'),
        `Route path "${path}" will be treated as if it were ` +
          `"${path.replace(/\*$/, '/*')}" because the \`*\` character must ` +
          'always follow a `/` in the pattern. To get rid of this warning, ' +
          `please change the route path to "${path.replace(/\*$/, '/*')}".`,
      );

      const params: CompiledPathParam[] = [];
      let regexpSource = `^${path
        .replace(/\/*\*?$/, '') // Ignore trailing / and /*, we'll handle it below
        .replace(/^\/*/, '/') // Make sure it has a leading /
        .replace(/[\\.*+^${}|()[\]]/g, '\\$&') // Escape special regex chars
        .replace(
          /\/:([\w-]+)(\?)?/g,
          (_: string, paramName: string, isOptional) => {
            params.push({ paramName, isOptional: isOptional != null });
            return isOptional ? '/?([^\\/]+)?' : '/([^\\/]+)';
          },
        )}`;

      if (path.endsWith('*')) {
        params.push({ paramName: '*' });
        regexpSource +=
          path === '*' || path === '/*' ?
            '(.*)$' // Already matched the initial /, just match the rest
          : '(?:\\/(.+)|\\/*)$'; // Don't include the / in params["*"]
      } else if (end) {
        // When matching to the end, ignore trailing slashes
        regexpSource += '\\/*$';
      } else if (path !== '' && path !== '/') {
        // If our path is non-empty and contains anything beyond an initial slash,
        // then we have _some_ form of path in our regex, so we should expect to
        // match only if we find the end of this path segment.  Look for an optional
        // non-captured trailing slash (to match a portion of the URL) or the end
        // of the path (if we've matched to the end).  We used to do this with a
        // word boundary but that gives false positives on routes like
        // /user-preferences since `-` counts as a word boundary.
        regexpSource += '(?:(?=\\/|$))';
      } else {
        // Nothing to match for "" or "/"
      }

      const matcher = new RegExp(regexpSource, caseSensitive ? undefined : 'i');

      return [matcher, params];
    },
  );
}

export function matchPathWith(path: string | undefined | null): {
  patterns: <R>(patterns: Record<string, (match: PathMatch) => R>) => R | null;
} {
  return {
    patterns: (patternsToMatch) => {
      if (!path) return null;

      for (const [key, pattern] of Object.entries(patternsToMatch)) {
        const match = matchPath(key, path);

        if (match) {
          return pattern(match);
        }
      }

      return null;
    },
  };
}
