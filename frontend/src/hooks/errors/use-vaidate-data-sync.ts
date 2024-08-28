import { skipToken } from '@reduxjs/toolkit/query';
import { useParams } from 'react-router';
import { ErrorState, INITIAL_ERRORS } from '@app/hooks/errors/types';
import { useGetCaseQuery } from '@app/redux-api/case/api';
import { Case, CaseUpdatable } from '@app/redux-api/case/types';

const isKeyofCaseUpdatable = (key: string): key is keyof CaseUpdatable =>
  key === 'vedtakDate' ||
  key === 'caseIsAtKA' ||
  key === 'userSaksnummer' ||
  key === 'fritekst' ||
  key === 'vedlegg' ||
  key === 'checkboxesSelected';

export const useValidateDataSync = () => {
  const { id } = useParams();
  const { refetch } = useGetCaseQuery(id ?? skipToken);

  return async (userData: CaseUpdatable): Promise<[true, ErrorState] | [false, undefined]> => {
    // todo sjekk at dette ikke oppdaterer state
    const { data } = await refetch();

    if (data === undefined) {
      return [false, undefined];
    }

    return localCaseIsSynced(userData, data);
  };
};

const localCaseIsSynced = (userData: CaseUpdatable, serverData: Case): [true, ErrorState] | [false, undefined] => {
  const errors = { ...INITIAL_ERRORS };
  let hasErrors = false;

  for (const key in userData) {
    if (!isKeyofCaseUpdatable(key)) {
      continue;
    }

    if (userData[key] !== serverData[key]) {
      hasErrors = true;

      errors[key] = 'Dataene har ikke blitt lagret. Kopier dataene og last siden på nytt.';
    }
  }

  return hasErrors ? [false, undefined] : [true, errors];
};
