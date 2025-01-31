import { getQueryValue } from '@app/functions/get-query-value';
import { useSessionCase } from '@app/hooks/use-session-klage';
import type { Innsendingsytelse } from '@app/innsendingsytelser/innsendingsytelser';
import { useLanguage } from '@app/language/use-language';
import { useTranslation } from '@app/language/use-translation';
import { useCreateCaseMutation, useResumeOrCreateCaseMutation } from '@app/redux-api/case/api';
import type { CaseType } from '@app/redux-api/case/types';
import { useGetUserQuery } from '@app/redux-api/user/api';
import { useAppDispatch } from '@app/redux/configure-store';
import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { handleCreateCase, handleResumeOrCreateCase, handleSessionCase } from './handlers';

interface IResult {
  error: string | null;
  loading: string;
}

export const useCase = (type: CaseType, innsendingsytelse: Innsendingsytelse): IResult => {
  const navigate = useNavigate();
  const language = useLanguage();
  const { case_loader, error_messages } = useTranslation();
  const [query] = useSearchParams();
  const { data: user, isLoading: isLoadingUser, isSuccess } = useGetUserQuery();

  const internalSaksnummer = getQueryValue(query.get('saksnummer'));

  const [createCase, { isLoading: createIsLoading, isError: createHasFailed, isSuccess: createIsSuccess }] =
    useCreateCaseMutation();

  const [resumeOrCreateCase, { isLoading: resumeIsLoading, isError: resumeHasFailed, isSuccess: resumeIsSuccess }] =
    useResumeOrCreateCaseMutation();

  const [sessionCase, sessionCaseIsLoading] = useSessionCase(type, innsendingsytelse, internalSaksnummer);
  const dispatch = useAppDispatch();

  const isLoading = isLoadingUser || createIsLoading || resumeIsLoading;
  const isDone = createHasFailed || createIsSuccess || resumeHasFailed || resumeIsSuccess;

  useEffect(() => {
    if (!isSuccess || isLoading || isDone || sessionCaseIsLoading || innsendingsytelse === null) {
      return;
    }

    if (user === undefined) {
      handleSessionCase({
        type,
        dispatch,
        internalSaksnummer,
        innsendingsytelse,
        language,
        navigate,
        sessionCase,
      });

      return;
    }

    if (sessionCase !== null && sessionCase.foedselsnummer === user.folkeregisteridentifikator?.identifikasjonsnummer) {
      handleCreateCase({
        createCase,
        dispatch,
        internalSaksnummer,
        innsendingsytelse,
        language,
        navigate,
        sessionCase,
      });

      return;
    }

    handleResumeOrCreateCase({
      type,
      internalSaksnummer,
      innsendingsytelse,
      language,
      navigate,
      resumeOrCreateCase,
    });
  }, [
    createCase,
    dispatch,
    innsendingsytelse,
    internalSaksnummer,
    isDone,
    isLoading,
    isSuccess,
    language,
    navigate,
    resumeOrCreateCase,
    sessionCase,
    sessionCaseIsLoading,
    type,
    user,
  ]);

  const hasFailed = createHasFailed || resumeHasFailed;

  const error = hasFailed ? error_messages.create_error[type] : null;

  const { loading } = case_loader;

  return { error, loading };
};
