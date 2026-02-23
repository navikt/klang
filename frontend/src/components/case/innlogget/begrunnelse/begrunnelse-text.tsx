import { AutosaveProgressIndicator } from '@app/components/autosave-progress/autosave-progress';
import { FormFieldsIds } from '@app/components/case/common/form-fields-ids';
import { isError } from '@app/functions/is-api-error';
import { useOnUnmount } from '@app/hooks/use-on-unmount';
import { useTranslation } from '@app/language/use-translation';
import { useUpdateCaseMutation } from '@app/redux-api/case/api';
import type { CaseType } from '@app/redux-api/case/types';
import { Textarea, type TextareaProps } from '@navikt/ds-react';
import type { SerializedError } from '@reduxjs/toolkit';
import type { FetchBaseQueryError } from '@reduxjs/toolkit/query';
import { type ReactNode, useCallback, useEffect, useState } from 'react';

interface Props extends Omit<TextareaProps, 'label' | 'onError' | 'onChange'> {
  caseId: string;
  value: string;
  label: string;
  modified: string;
  type: CaseType;
}

export const BegrunnelseText = ({ caseId, value, modified, error, type, ...props }: Props) => {
  const [localValue, setLocalValue] = useState(value);
  const [updateCase, { reset, ...status }] = useUpdateCaseMutation({ fixedCacheKey: caseId });
  const [lastSaved, setLastSaved] = useState<string>(modified);
  const errorMessage = useErrorMessage(type, status.error, error);

  const updateFritekst = useCallback(
    async (newValue: string) => {
      const { modifiedByUser } = await updateCase({ key: 'fritekst', value: newValue, id: caseId }).unwrap();
      setLastSaved(modifiedByUser);
    },
    [caseId, updateCase],
  );

  useEffect(() => {
    if (value === localValue || status.isError) {
      return;
    }

    const timeout = setTimeout(() => updateFritekst(localValue), 1000);

    return () => clearTimeout(timeout);
  }, [value, localValue, updateFritekst, status.isError]);

  useOnUnmount(() => {
    if (value !== localValue) {
      updateCase({ key: 'fritekst', value: localValue, id: caseId });
    }
  });

  return (
    <div>
      <Textarea
        id={FormFieldsIds.FRITEKST}
        maxLength={0}
        minLength={1}
        minRows={10}
        onChange={({ target }) => {
          reset(); // Reset (error) status for every change, so the user can see if the next save attempt fails or succeeds
          setLocalValue(target.value);
        }}
        value={localValue}
        placeholder="Skriv her"
        error={errorMessage}
        {...props}
      />
      <AutosaveProgressIndicator {...status} lastSaved={lastSaved} />
    </div>
  );
};

const useErrorMessage = (
  type: CaseType,
  rtkqError: FetchBaseQueryError | SerializedError | undefined,
  validationError: ReactNode,
) => {
  const { skjema } = useTranslation();
  const { failed } = skjema.begrunnelse.autosave;

  if (isError(rtkqError) && rtkqError.status === 409) {
    return skjema.begrunnelse.errors.finished[type];
  }

  return rtkqError === undefined ? validationError : failed;
};
