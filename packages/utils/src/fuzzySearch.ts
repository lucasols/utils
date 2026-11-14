import uFuzzy from '@leeoniya/ufuzzy';

type SearchOptions<T> = {
  items: T[];
  getStringToMatch: (item: T) => string;
  searchQuery: string | null;
  /** Pass a stable uFuzzy instance, you can use `getUFuzzyInstance` for this */
  uFuzzy: uFuzzy;
  ignoreBestMatch?: boolean;
  throwOnError?: boolean;
  /**
   * Match the words of the query in any order, e.g. `ferreira joao` matches
   * `João Ferreira`. Among matches of the same quality, the ones with the words
   * in the query order come first.
   *
   * The results are ranked with the criteria of `getUFuzzyInstance`, a custom
   * `sort` of the uFuzzy instance is not used. Queries with more than 5 words
   * are matched in any order but keep the order of `items`.
   */
  matchWordsInAnyOrder?: boolean;
};

/** Every word order is searched by uFuzzy, 5 words are 120 searches */
const MAX_WORDS_TO_REORDER = 5;

/**
 * Performs fuzzy search on a list of items and returns matched items with score
 * metadata.
 *
 * Uses uFuzzy for efficient fuzzy matching with Latin character normalization.
 * Falls back to simple string inclusion matching if an error occurs.
 *
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
  matchWordsInAnyOrder,
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
      matchWordsInAnyOrder ? MAX_WORDS_TO_REORDER : 0,
    );

    if (!filteredIndexes) {
      filteredIndexes = [];
    }

    if (matchWordsInAnyOrder && info && orderedIndexes?.length) {
      // uFuzzy ranks each word order on its own and lists the query order
      // first, so a weak match in the query order would come before an exact
      // match in another order. Rank all the matches together instead.
      const [inQueryOrderIndexes] = uf.search(searchStrings, searchQuery, 0, 0);

      orderedIndexes = sortMatches(
        info,
        searchStrings,
        new Set(inQueryOrderIndexes),
      );
    }

    const sortedItems: T[] = [];
    let bestMatchScore: undefined | number = undefined;

    if (info && orderedIndexes) {
      for (const filteredIndex of orderedIndexes) {
        // `info` can have fewer entries than `filteredIndexes`, `info.idx` is
        // the one aligned with `orderedIndexes`
        const index = info.idx[filteredIndex];

        if (index === undefined) continue;

        const item = items[index];

        if (item) {
          if (!ignoreBestMatch && bestMatchScore === undefined) {
            const start = info.start[filteredIndex] ?? 0;
            const chars = info.chars[filteredIndex] ?? 0;
            const terms = info.terms[filteredIndex] ?? 0;
            const inter =
              (info.interLft2[filteredIndex] ?? 0)
              + (info.interRgt2[filteredIndex] ?? 0);
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
  matchWordsInAnyOrder,
}: Omit<SearchOptions<T>, 'ignoreBestMatch'>): T[] {
  return fuzzySearchItemsWithResultMetadata({
    items,
    searchQuery: _searchQuery,
    getStringToMatch,
    uFuzzy: uf,
    ignoreBestMatch: true,
    matchWordsInAnyOrder,
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
    sort: (info, haystack) => sortMatches(info, haystack),
  });
}

/**
 * @param inQueryOrderIndexes - Haystack indexes that match the words in the
 *   query order, the other matches are ranked after them when the match quality
 *   is the same
 */
function sortMatches(
  info: uFuzzy.Info,
  haystack: string[],
  inQueryOrderIndexes?: Set<number>,
): uFuzzy.InfoIdxOrder {
  const { idx, chars, terms, interLft2, interLft1, start, intraIns, interIns } =
    info;

  const wordOrderRank = idx.map((haystackIndex) =>
    !inQueryOrderIndexes || inQueryOrderIndexes.has(haystackIndex) ? 0 : 1,
  );

  return idx
    .map((_, i) => i)
    .sort(
      (ia, ib) =>
        // most contiguous chars matched
        chars[ib]! - chars[ia]!
        // least char intra-fuzz (most contiguous)
        || intraIns[ia]! - intraIns[ib]!
        // most prefix bounds, boosted by full term matches
        || terms[ib]!
          + interLft2[ib]!
          + 0.5 * interLft1[ib]!
          - (terms[ia]! + interLft2[ia]! + 0.5 * interLft1[ia]!)
        // words in the query order
        || (wordOrderRank[ia] ?? 0) - (wordOrderRank[ib] ?? 0)
        // highest density of match (least term inter-fuzz)
        || interIns[ia]! - interIns[ib]!
        // earliest start of match
        || start[ia]! - start[ib]!
        // shortest match
        || haystack[idx[ia]!]!.length - haystack[idx[ib]!]!.length
        // alphabetic
        || cmp(haystack[idx[ia]!]!, haystack[idx[ib]!]!),
    );
}

const cmp = new Intl.Collator('en', { numeric: true, sensitivity: 'base' })
  .compare;

function normalizeSearchQuery(searchQuery: string) {
  let normalized = searchQuery.trim();

  normalized = uFuzzy.latinize(normalized);

  return normalized;
}
