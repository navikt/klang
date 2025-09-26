import type { ISessionCase } from '@app/components/case/uinnlogget/types';
import type { Innsendingsytelse } from '@app/innsendingsytelser/innsendingsytelser';
import type { Languages } from '@app/language/types';
import { AppEventEnum } from '@app/logging/action';
import { appEvent } from '@app/logging/logger';
import type { AppDispatch } from '@app/redux/configure-store';
import { createSessionCase } from '@app/redux/session/klage/helpers';
import { deleteSessionCase, setSessionCase, updateSessionCase } from '@app/redux/session/session';
import type { useCreateCaseMutation, useResumeOrCreateCaseMutation } from '@app/redux-api/case/api';
import type { CreateCaseFields } from '@app/redux-api/case/types';
import { CASE_TYPE_PATH_SEGMENTS, type CaseType, type DeepLinkParams } from '@app/redux-api/case/types';
import type { NavigateFunction } from 'react-router-dom';

interface IHandler {
  language: Languages;
  navigate: NavigateFunction;
  innsendingsytelse: Innsendingsytelse;
  deepLinkParams: DeepLinkParams;
}

interface IHandleSession extends IHandler {
  dispatch: AppDispatch;
  sessionCase: ISessionCase | null;
  type: CaseType;
}

const changedDeepLink = (oldCase: ISessionCase, deepLinkParams: DeepLinkParams): boolean =>
  (deepLinkParams.internalSaksnummer !== null && deepLinkParams.internalSaksnummer !== oldCase.internalSaksnummer) ||
  (deepLinkParams.sakSakstype !== null && deepLinkParams.sakSakstype !== oldCase.sakSakstype) ||
  (deepLinkParams.sakFagsaksystem !== null && deepLinkParams.sakFagsaksystem !== oldCase.sakFagsaksystem) ||
  (deepLinkParams.caseIsAtKA === true && deepLinkParams.caseIsAtKA !== oldCase.caseIsAtKA);

export const handleSessionCase = ({
  dispatch,
  sessionCase,
  type,
  innsendingsytelse,
  deepLinkParams,
  language,
  navigate,
}: IHandleSession) => {
  if (sessionCase === null) {
    appEvent(AppEventEnum.CASE_CREATE_SESSION);
    dispatch(
      setSessionCase({ type, innsendingsytelse, data: createSessionCase({ type, innsendingsytelse, deepLinkParams }) }),
    );
  } else if (changedDeepLink(sessionCase, deepLinkParams)) {
    appEvent(AppEventEnum.CASE_RESUME_SESSION_WITH_CHANGED_DEEP_LINK);
    dispatch(updateSessionCase({ type, innsendingsytelse: innsendingsytelse, data: deepLinkParams }));
  } else {
    appEvent(AppEventEnum.CASE_RESUME_SESSION);
  }

  navigate(`/${language}/${CASE_TYPE_PATH_SEGMENTS[type]}/${innsendingsytelse.toLowerCase()}/begrunnelse`, {
    replace: true,
  });
};

interface IHandleCreate extends IHandler {
  dispatch: AppDispatch;
  sessionCase: ISessionCase;
  createCase: ReturnType<typeof useCreateCaseMutation>[0];
}

export const handleCreateCase = ({
  sessionCase,
  innsendingsytelse,
  language,
  createCase,
  dispatch,
  navigate,
}: IHandleCreate) => {
  appEvent(AppEventEnum.CASE_CREATE_FROM_SESSION_STORAGE);
  createCase(getCreatePayload(sessionCase, language))
    .unwrap()
    .then(({ id }) => {
      dispatch(deleteSessionCase({ type: sessionCase.type, innsendingsytelse }));
      navigate(`/${language}/sak/${id}/begrunnelse`, { replace: true });
    });
};

interface IHandleResumeOrCreate extends IHandler {
  resumeOrCreateCase: ReturnType<typeof useResumeOrCreateCaseMutation>[0];
  language: Languages;
  type: CaseType;
}

export const handleResumeOrCreateCase = ({
  type,
  innsendingsytelse,
  deepLinkParams,
  language,
  navigate,
  resumeOrCreateCase,
}: IHandleResumeOrCreate) => {
  appEvent(AppEventEnum.CASE_CREATE_OR_RESUME);
  resumeOrCreateCase({ innsendingsytelse, type, ...deepLinkParams })
    .unwrap()
    .then(({ id }) => navigate(`/${language}/sak/${id}/begrunnelse`, { replace: true }));
};

const getCreatePayload = (
  { type, id, navn, modifiedByUser, ...rest }: ISessionCase,
  language: Languages,
): CreateCaseFields => ({ type, ...rest, language });
