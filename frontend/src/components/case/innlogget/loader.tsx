import { LoadingPage } from '@app/components/loading-page/loading-page';
import { redirectToNav } from '@app/functions/redirect-to-nav';
import { useTranslation } from '@app/language/use-translation';
import { errorEvent } from '@app/logging/logger';
import { useGetCaseQuery } from '@app/redux-api/case/api';
import type { Case } from '@app/redux-api/case/types';
import { useGetUserQuery } from '@app/redux-api/user/api';
import { Alert } from '@navikt/ds-react';
import { skipToken } from '@reduxjs/toolkit/query';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

interface Props {
  Component: React.ComponentType<{ data: Case }>;
}

export const CaseLoader = ({ Component }: Props) => {
  const { id } = useParams();
  const { case_loader: klage_loader } = useTranslation();
  const [error, setError] = useState<string | null>(null);
  const { data: user } = useGetUserQuery();

  const { data, isLoading, isError, error: apiError } = useGetCaseQuery(id ?? skipToken);

  useEffect(() => {
    if (typeof id !== 'string') {
      const e = new Error('ID is missing');
      errorEvent(e.message, e.stack);
      setError(klage_loader.format_error('INGEN', e));

      console.error('ID is missing');
      redirectToNav();

      return;
    }

    if (isError) {
      const e = new Error(`Case not found. Error: ${JSON.stringify(apiError)}`);

      errorEvent(
        e.message,
        e.stack,
        user === undefined ? undefined : user.folkeregisteridentifikator?.identifikasjonsnummer,
      );

      setError(klage_loader.format_error(id, e));

      redirectToNav();
    }
  }, [id, klage_loader, isError, apiError, user]);

  if (error !== null) {
    return <Alert variant="error">{error}</Alert>;
  }

  if (isLoading || data === undefined) {
    return <LoadingPage>{klage_loader.loading}</LoadingPage>;
  }

  return <Component data={data} />;
};
