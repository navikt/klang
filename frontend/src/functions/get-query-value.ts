export const getQueryValue = (queryValue: string | null): string | null => {
  if (queryValue === null || queryValue.length === 0) {
    return null;
  }

  return queryValue;
};

/**
 * Get a boolean value from a query string.
 * `null`, `'false'` and `'0'` will return `false`, everything else will return `true`.
 */
export const getBooleanQueryValue = (queryValue: string | null): boolean =>
  queryValue !== null && queryValue !== 'false' && queryValue !== '0';
