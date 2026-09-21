import { getBooleanQueryValue, getQueryValue } from '@app/functions/get-query-value';
import type { DeepLinkParams } from '@app/redux-api/case/types';
import { useMemo } from 'react';
import { useSearchParams } from 'react-router';

/** Reads the deep link query parameters used when Nav links directly into a specific case. */
export const useDeepLinkParams = (): DeepLinkParams => {
  const [query] = useSearchParams();

  const internalSaksnummer = getQueryValue(query.get('saksnummer'));
  const sakSakstype = getQueryValue(query.get('sakstype'));
  const sakFagsaksystem = getQueryValue(query.get('fagsystem'));
  const caseIsAtKA = getBooleanQueryValue(query.get('ka')) ? true : null;

  return useMemo(
    () => ({ internalSaksnummer, sakSakstype, sakFagsaksystem, caseIsAtKA }),
    [internalSaksnummer, sakSakstype, sakFagsaksystem, caseIsAtKA],
  );
};
