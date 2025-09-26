import type { ISessionCase } from '@app/components/case/uinnlogget/types';
import type { Innsendingsytelse } from '@app/innsendingsytelser/innsendingsytelser';
import { useAppDispatch, useAppSelector } from '@app/redux/configure-store';
import { getSessionCaseKey } from '@app/redux/session/klage/helpers';
import { loadOrCreateSessionCase } from '@app/redux/session/session';
import type { CaseType, DeepLinkParams } from '@app/redux-api/case/types';
import { useEffect, useMemo } from 'react';

export const useSessionCase = (
  type: CaseType,
  innsendingsytelse: Innsendingsytelse,
  deepLinkParams: DeepLinkParams,
): [ISessionCase, false] | [undefined, true] => {
  const dispatch = useAppDispatch();
  const sessionCaseMap = useAppSelector((state) => state.session);

  const data = useMemo(
    () => sessionCaseMap[getSessionCaseKey(type, innsendingsytelse)],
    [innsendingsytelse, sessionCaseMap, type],
  );

  useEffect(() => {
    if (data === undefined) {
      dispatch(loadOrCreateSessionCase({ type, innsendingsytelse, deepLinkParams }));
    }
  }, [data, dispatch, deepLinkParams, innsendingsytelse, type]);

  if (data === undefined) {
    return [undefined, true];
  }

  return [data, false];
};
