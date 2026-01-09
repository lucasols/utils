import uFuzzy from '@leeoniya/ufuzzy';

type SearchOptions<T> = {
  items: T[];
  getStringToMatch: (item: T) => string;
  searchQuery: string | null;
  /** Pass a stable uFuzzy instance, you can use `getUFuzzyInstance` for this */
  uFuzzy: uFuzzy;
  ignoreBestMatch?: boolean;
  throwOnError?: boolean;
};

/**
 * Performs fuzzy search on a list of items and returns matched items with score
 * metadata.
 *
 * Uses uFuzzy for efficient fuzzy matching with Latin character normalization.
 * Falls back to simple string inclusion matching if an error occurs.
 *
 * @param options - Configuration options for the fuzzy search
 * @param options.items - Array of items to search through
 * @param options.getStringToMatch - Function that extracts the string to match
 *   from each item
 * @param options.searchQuery - The search query string (null or empty string
 *   returns all items)
 * @param options.uFuzzy - Configured uFuzzy instance (use `getUFuzzyInstance`
 *   to create one)
 * @param options.ignoreBestMatch - If true, skips calculating the best match
 *   score for performance
 * @param options.throwOnError - If true, throws errors instead of falling back
 *   to simple string matching
 * @returns Object containing filtered/sorted items and the best match score
 *   (higher is better)
 */
export function fuzzySearchItemsWithResultMetadata<T>({
  items,
  searchQuery: _searchQuery,
  getStringToMatch,
  uFuzzy: uf,
  ignoreBestMatch,
  throwOnError,
}: SearchOptions<T>): { items: T[]; bestMatchScore: number } {
  const searchQuery = normalizeSearchQuery(_searchQuery ?? '');

  if (!searchQuery) {
    return { items, bestMatchScore: 0 };
  }

  try {
    const searchStrings = items.map((item) =>
      uFuzzy.latinize(getStringToMatch(item)),
    );

    let [filteredIndexes, info, orderedIndexes] = uf.search(
      searchStrings,
      searchQuery,
    );

    if (!filteredIndexes) {
      filteredIndexes = [];
    }

    const sortedItems: T[] = [];
    let bestMatchScore: undefined | number = undefined;

    if (orderedIndexes) {
      for (const filteredIndex of orderedIndexes) {
        const index = filteredIndexes[filteredIndex]!;

        const item = items[index];

        if (item) {
          if (!ignoreBestMatch && bestMatchScore === undefined && info) {
            const start = info.start[filteredIndex] ?? 0;
            const chars = info.chars[filteredIndex] ?? 0;
            const terms = info.terms[filteredIndex] ?? 0;
            const inter =
              (info.interLft2[filteredIndex] ?? 0) +
              (info.interRgt2[filteredIndex] ?? 0);
            bestMatchScore = 50 - start;
            const intra = info.intraIns[filteredIndex] ?? 0;

            const itemStringLength = searchStrings[index]?.length ?? 0;

            const density = chars / itemStringLength;

            bestMatchScore += density * 10;
            bestMatchScore += terms * 10;
            bestMatchScore += inter * 10;
            bestMatchScore += intra * 10;
          }

          sortedItems.push(item);
        }
      }
    } else {
      for (const i of filteredIndexes) {
        if (items[i]) {
          sortedItems.push(items[i]);
        }
      }
    }

    return { items: sortedItems, bestMatchScore: bestMatchScore ?? 0 };
  } catch (e) {
    if (throwOnError) {
      throw e;
    }

    console.error(e);

    return {
      items: items.filter((item) =>
        getStringToMatch(item).includes(searchQuery),
      ),
      bestMatchScore: 0,
    };
  }
}

/**
 * Performs fuzzy search on a list of items and returns matched items.
 *
 * Simplified version of `fuzzySearchItemsWithResultMetadata` that only returns
 * items.
 */
export function fuzzySearchItems<T>({
  items,
  searchQuery: _searchQuery,
  getStringToMatch,
  uFuzzy: uf,
}: Omit<SearchOptions<T>, 'ignoreBestMatch'>): T[] {
  return fuzzySearchItemsWithResultMetadata({
    items,
    searchQuery: _searchQuery,
    getStringToMatch,
    uFuzzy: uf,
    ignoreBestMatch: true,
  }).items;
}

/**
 * Creates a configured uFuzzy instance with custom sorting for optimal fuzzy
 * matching.
 *
 * The instance uses intraMode=1 and custom sorting that prioritizes: contiguous
 * character matches, prefix bounds, match density, and early start position.
 */
export function getUFuzzyInstance() {
  return new uFuzzy({
    intraMode: 1,
    sort(info, haystack) {
      const {
        idx,
        chars,
        terms,
        interLft2,
        interLft1,
        start,
        intraIns,
        interIns,
      } = info;

      return idx
        .map((_, i) => i)
        .sort(
          (ia, ib) =>
            // most contiguous chars matched
            chars[ib]! - chars[ia]! ||
            // least char intra-fuzz (most contiguous)
            intraIns[ia]! - intraIns[ib]! ||
            // most prefix bounds, boosted by full term matches
            terms[ib]! +
              interLft2[ib]! +
              0.5 * interLft1[ib]! -
              (terms[ia]! + interLft2[ia]! + 0.5 * interLft1[ia]!) ||
            // highest density of match (least term inter-fuzz)
            interIns[ia]! - interIns[ib]! ||
            // earliest start of match
            start[ia]! - start[ib]! ||
            // shortest match
            haystack[idx[ia]!]!.length - haystack[idx[ib]!]!.length ||
            // alphabetic
            cmp(haystack[idx[ia]!]!, haystack[idx[ib]!]!),
        );
    },
  });
}

const cmp = new Intl.Collator('en', { numeric: true, sensitivity: 'base' })
  .compare;

function normalizeSearchQuery(searchQuery: string) {
  let normalized = searchQuery.trim();

  normalized = uFuzzy.latinize(normalized);

  return normalized;
}
