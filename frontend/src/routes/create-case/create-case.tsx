import { LoadingPage } from '@app/components/loading-page/loading-page';
import type { Innsendingsytelse } from '@app/innsendingsytelser/innsendingsytelser';
import type { CaseType } from '@app/redux-api/case/types';
import { Alert } from '@navikt/ds-react';
import { useCase } from './use-case';

interface Props {
  innsendingsytelse: Innsendingsytelse;
  type: CaseType;
}

export const CreateCase = ({ innsendingsytelse, type }: Props) => {
  const { error, loading } = useCase(type, innsendingsytelse);

  if (error !== null) {
    return <Alert variant="error">{error}</Alert>;
  }

  return <LoadingPage>{loading}</LoadingPage>;
};
