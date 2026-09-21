import type { ISessionCase } from '@app/components/case/uinnlogget/types';
import { getUniqueId } from '@app/functions/uuid';
import { useDeepLinkParams } from '@app/hooks/use-deep-link-params';
import type { Innsendingsytelse } from '@app/innsendingsytelser/innsendingsytelser';
import { sessionEvent } from '@app/logging/logger';
import { SessionAction } from '@app/logging/types';
import type { CaseType, DeepLinkParams } from '@app/redux-api/case/types';
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { Outlet } from 'react-router';

interface SessionCaseContextValue {
  readonly type: CaseType;
  readonly innsendingsytelse: Innsendingsytelse;
  readonly sessionCase: ISessionCase;
  readonly updateSessionCase: (update: Partial<ISessionCase>) => void;
  readonly deleteSessionCase: () => void;
}

const SessionCaseContext = createContext<SessionCaseContextValue | null>(null);

export const useSessionCase = (): SessionCaseContextValue => {
  const context = useContext(SessionCaseContext);

  if (context === null) {
    throw new Error('useSessionCase must be used within a SessionCaseProvider');
  }

  return context;
};

interface Props {
  type: CaseType;
  innsendingsytelse: Innsendingsytelse;
}

/** Route element for the logged out case routes. Provides the single in-memory case for `type` and the ytelse in the path. */
export const SessionCaseProvider = ({ type, innsendingsytelse }: Props) => {
  // Keyed to drop the case when the user moves to another case type or ytelse. Only one case exists at a time.
  return <Provider key={`${type}/${innsendingsytelse}`} type={type} innsendingsytelse={innsendingsytelse} />;
};

interface ProviderProps extends Props {
  innsendingsytelse: Innsendingsytelse;
}

const RATE_LIMIT = 30_000;

const Provider = ({ type, innsendingsytelse }: ProviderProps) => {
  const deepLinkParams = useDeepLinkParams();
  const [sessionCase, setSessionCase] = useState<ISessionCase>(() => createSessionCase(deepLinkParams));
  const lastUpdated = useRef(0);

  useEffect(() => {
    sessionEvent(SessionAction.CREATE);
  }, []);

  const updateSessionCase = useCallback((update: Partial<ISessionCase>) => {
    // Rate limit updates.
    if (Date.now() - lastUpdated.current > RATE_LIMIT) {
      sessionEvent(SessionAction.UPDATE);
      lastUpdated.current = Date.now();
    }

    setSessionCase((existing) => ({ ...existing, ...update, modifiedByUser: new Date().toISOString() }));
  }, []);

  const deleteSessionCase = useCallback(() => {
    sessionEvent(SessionAction.DELETE);
    lastUpdated.current = 0;
    setSessionCase(createSessionCase(deepLinkParams));
  }, [deepLinkParams]);

  const value = useMemo(
    () => ({ type, innsendingsytelse, sessionCase, updateSessionCase, deleteSessionCase }),
    [type, innsendingsytelse, sessionCase, updateSessionCase, deleteSessionCase],
  );

  return (
    <SessionCaseContext.Provider value={value}>
      <Outlet />
    </SessionCaseContext.Provider>
  );
};

const createSessionCase = (deepLinkParams: DeepLinkParams): ISessionCase => ({
  id: getUniqueId(),
  foedselsnummer: '',
  navn: {
    fornavn: '',
    etternavn: '',
  },
  fritekst: '',
  userSaksnummer: null,
  vedtakDate: null,
  hasVedlegg: false,
  modifiedByUser: new Date().toISOString(),
  ...deepLinkParams,
});
