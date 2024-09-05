import type { ISessionCase } from '@app/components/case/uinnlogget/types';
import type { Innsendingsytelse } from '@app/innsendingsytelser/innsendingsytelser';
import type { CaseType } from '@app/redux-api/case/types';
import { useAppDispatch, useAppSelector } from '@app/redux/configure-store';
import { getSessionCaseKey } from '@app/redux/session/klage/helpers';
import { loadOrCreateSessionCase } from '@app/redux/session/session';
import { useEffect, useMemo } from 'react';

export const useSessionCase = (
  type: CaseType,
  innsendingsytelse: Innsendingsytelse,
  internalSaksnummer: string | null,
): [ISessionCase, false] | [undefined, true] => {
  const dispatch = useAppDispatch();
  const sessionCaseMap = useAppSelector((state) => state.session);

  const data = useMemo(
    () => sessionCaseMap[getSessionCaseKey(type, innsendingsytelse)],
    [innsendingsytelse, sessionCaseMap, type],
  );

  useEffect(() => {
    if (data === undefined) {
      dispatch(
        loadOrCreateSessionCase({
          type,
          innsendingsytelse,
          data: { innsendingsytelse, internalSaksnummer },
        }),
      );
    }
  }, [dispatch, innsendingsytelse, internalSaksnummer, data, type]);

  if (data === undefined) {
    return [undefined, true];
  }

  return [data, false];
};
