import { difference, intersection, isEqual } from 'lodash';

import { SearchKeyset, SearchParams } from './index';

/**
 * Does every element in the first list exist in the second list and vice versa?
 */
function isExactSet<A>(a: A[], b: A[]): boolean {
  return difference(b, a).length === 0;
}

/**
 * Does every element in the first list exist in the second list?
 */
function isSubset<A>(a: A[], b: A[]): boolean {
  return a.every((item: A) => b.indexOf(item) > -1);
}

/**
 * Does every intersecting key in the first object exist with the same value in the second object?
 */
function isIntersectionEqual(a: SearchParams, b: SearchParams): boolean {
  const intersectingKeys = intersection(Object.keys(a), Object.keys(b));
  return (
    intersectingKeys.length > 0 &&
    intersectingKeys.every((key: string) => a[key] === b[key])
  );
}

export interface SearchMatchParams {
  search: SearchParams;
  searchKeyset: SearchKeyset;
  isExact: boolean;
}

/**
 * Given a set of keys (and values), checks to see if those match against a given search string.
 * TODO: this should support passing through both a search and a searchKeyset!
 */
export default function matchSearch(
  search: SearchParams | undefined,
  searchKeyset: SearchKeyset = [],
  exact: boolean,
  currentSearchString: string
): SearchMatchParams | null {
  const urlSearchParams = new URLSearchParams(currentSearchString);
  const currentKeyset = Array.from(urlSearchParams.keys());

  const currentSearch: SearchParams = currentKeyset.reduce(
    (acc: SearchParams, currentKey: string): SearchParams => {
      return {
        ...acc,
        [currentKey]: urlSearchParams.get(currentKey)
      };
    },
    {}
  );

  if (search) {
    const isExactMatch = isEqual(search, currentSearch);
    const isIntersectingMatch =
      !exact && isIntersectionEqual(search, currentSearch);

    if (isExactMatch || isIntersectingMatch) {
      return {
        isExact: isExactMatch,
        search: currentSearch,
        searchKeyset
      };
    }
  } else if (searchKeyset.length > 0) {
    const doesIntersect = isSubset(searchKeyset, currentKeyset);
    const isExact = doesIntersect && isExactSet(searchKeyset, currentKeyset);

    if ((exact && isExact) || (!exact && doesIntersect)) {
      return {
        isExact,
        search: currentSearch,
        searchKeyset
      };
    }
  } else if (!search && searchKeyset.length === 0) {
    const hasKeys = currentKeyset.length > 0;
    if (exact && !hasKeys) {
      return {
        isExact: true,
        search: currentSearch,
        searchKeyset
      };
    }
    if (!exact) {
      return {
        isExact: !hasKeys,
        search: currentSearch,
        searchKeyset
      };
    }
  }

  return null;
}
