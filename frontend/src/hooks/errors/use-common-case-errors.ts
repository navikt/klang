import { FormFieldsIds } from '@app/components/case/common/form-fields-ids';
import { useValidators } from '@app/components/case/common/validators';
import type { ISessionCase } from '@app/components/case/uinnlogget/types';
import { FORMAT } from '@app/components/date-picker/constants';
import { type ErrorState, INITIAL_ERRORS, type ValidateFnFactory } from '@app/hooks/errors/types';
import { type Case, CaseType } from '@app/redux-api/case/types';
import { parse } from 'date-fns';
import { useCallback } from 'react';

export const useValidateCommonCaseFn: ValidateFnFactory<Case | ISessionCase> = (type: CaseType) => {
  const { validateCaseIsAtKa, validateVedtakDateRequired, validateVedtakDate } = useValidators();

  return useCallback(
    (data) => {
      const errors: ErrorState = { ...INITIAL_ERRORS };
      const { vedtakDate, caseIsAtKA } = data;

      if (type === CaseType.ANKE || type === CaseType.ETTERSENDELSE_ANKE) {
        const date = vedtakDate === null ? null : parse(vedtakDate, FORMAT, new Date());
        errors[FormFieldsIds.VEDTAK_DATE] = validateVedtakDateRequired(date);
      } else if (type === CaseType.KLAGE || type === CaseType.ETTERSENDELSE_KLAGE) {
        const date = vedtakDate === null ? null : parse(vedtakDate, FORMAT, new Date());
        errors[FormFieldsIds.VEDTAK_DATE] = validateVedtakDate(date);
      }

      if (type === CaseType.ETTERSENDELSE_KLAGE) {
        errors[FormFieldsIds.CASE_IS_AT_KA] = validateCaseIsAtKa(caseIsAtKA);
      }

      return errors;
    },
    [type, validateCaseIsAtKa, validateVedtakDate, validateVedtakDateRequired],
  );
};
