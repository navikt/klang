import type { ISessionCase } from '@app/components/case/uinnlogget/types';
import type { Innsendingsytelse } from '@app/innsendingsytelser/innsendingsytelser';
import type { Languages } from '@app/language/types';
import { AppEventEnum } from '@app/logging/action';
import { appEvent } from '@app/logging/logger';
import type { useCreateCaseMutation, useResumeOrCreateCaseMutation } from '@app/redux-api/case/api';
import type { CreateCaseParams } from '@app/redux-api/case/params';
import { CASE_TYPE_PATH_SEGMENTS, type CaseType } from '@app/redux-api/case/types';
import type { AppDispatch } from '@app/redux/configure-store';
import { createSessionCase } from '@app/redux/session/klage/helpers';
import { deleteSessionCase, setSessionCase, updateSessionCase } from '@app/redux/session/session';
import type { NavigateFunction } from 'react-router-dom';

interface IHandler {
  language: Languages;
  internalSaksnummer: string | null;
  navigate: NavigateFunction;
  innsendingsytelse: Innsendingsytelse;
}

interface IHandleSession extends IHandler {
  dispatch: AppDispatch;
  sessionCase: ISessionCase | null;
  type: CaseType;
}

export const handleSessionCase = ({
  type,
  sessionCase,
  innsendingsytelse,
  language,
  internalSaksnummer,
  navigate,
  dispatch,
}: IHandleSession) => {
  if (sessionCase === null) {
    appEvent(AppEventEnum.CASE_CREATE_SESSION);
    dispatch(
      setSessionCase({
        type,
        innsendingsytelse,
        data: createSessionCase(type, innsendingsytelse, internalSaksnummer),
      }),
    );
  } else if (internalSaksnummer !== null && internalSaksnummer !== sessionCase.internalSaksnummer) {
    appEvent(AppEventEnum.CASE_RESUME_SESSION_WITH_SAKSNUMMER);
    dispatch(updateSessionCase({ type, innsendingsytelse: innsendingsytelse, data: { internalSaksnummer } }));
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
  internalSaksnummer,
  innsendingsytelse,
  language,
  createCase,
  dispatch,
  navigate,
}: IHandleCreate) => {
  appEvent(AppEventEnum.CASE_CREATE_FROM_SESSION_STORAGE);
  createCase(getCreatePayload(sessionCase, language, internalSaksnummer))
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
  internalSaksnummer,
  language,
  navigate,
  resumeOrCreateCase,
}: IHandleResumeOrCreate) => {
  appEvent(AppEventEnum.CASE_CREATE_OR_RESUME);
  resumeOrCreateCase({ innsendingsytelse, internalSaksnummer, type })
    .unwrap()
    .then(({ id }) => navigate(`/${language}/sak/${id}/begrunnelse`, { replace: true }));
};

const getCreatePayload = (
  { type, ...data }: ISessionCase,
  language: Languages,
  internalSaksnummer: string | null = null,
): CreateCaseParams => {
  const { id, navn, modifiedByUser, ...rest } = data;

  return { type, ...rest, internalSaksnummer, language };
};
