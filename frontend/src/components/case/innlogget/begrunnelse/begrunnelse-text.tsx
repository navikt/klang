import { AutosaveProgressIndicator } from '@app/components/autosave-progress/autosave-progress';
import { FormFieldsIds } from '@app/components/case/common/form-fields-ids';
import { isError } from '@app/functions/is-api-error';
import { useOnUnmount } from '@app/hooks/use-on-unmount';
import { useTranslation } from '@app/language/use-translation';
import { useUpdateCaseMutation } from '@app/redux-api/case/api';
import { Textarea, type TextareaProps } from '@navikt/ds-react';
import { useCallback, useEffect, useState } from 'react';

interface Props extends Omit<TextareaProps, 'label' | 'onError' | 'onChange'> {
  caseId: string;
  value: string;
  label: string;
  modified: string;
}

export const BegrunnelseText = ({ caseId, value, modified, error, ...props }: Props) => {
  const [localValue, setLocalValue] = useState(value);
  const [updateCase, status] = useUpdateCaseMutation({ fixedCacheKey: caseId });
  const [lastSaved, setLastSaved] = useState<string>(modified);
  const { skjema } = useTranslation();
  const { failed } = skjema.begrunnelse.autosave;

  const updateFritekst = useCallback(
    async (newValue: string) => {
      const { modifiedByUser } = await updateCase({ key: 'fritekst', value: newValue, id: caseId }).unwrap();
      setLastSaved(modifiedByUser);
    },
    [caseId, updateCase],
  );

  const unauthorized = isError(status.error) && status.error.status === 401;

  useEffect(() => {
    if (value === localValue || unauthorized) {
      return;
    }

    const timeout = setTimeout(() => updateFritekst(localValue), 1000);

    return () => clearTimeout(timeout);
  }, [value, localValue, updateFritekst, unauthorized]);

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
        onChange={({ target }) => setLocalValue(target.value)}
        value={localValue}
        placeholder="Skriv her"
        error={status.isError ? failed : error}
        {...props}
      />
      <AutosaveProgressIndicator {...status} lastSaved={lastSaved} />
    </div>
  );
};
