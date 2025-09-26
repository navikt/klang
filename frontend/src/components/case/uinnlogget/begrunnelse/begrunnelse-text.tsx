import { FormFieldsIds } from '@app/components/case/common/form-fields-ids';
import type { CaseType } from '@app/redux-api/case/types';
import { Textarea, type TextareaProps } from '@navikt/ds-react';

interface Props extends Omit<TextareaProps, 'label' | 'onError' | 'onChange'> {
  value: string;
  onChange: (value: string) => void;
  error: string | undefined;
  label: string;
  type: CaseType;
}

export const BegrunnelseText = ({ error, label, onChange, ...props }: Props) => (
  <Textarea
    {...props}
    onChange={({ target }) => onChange(target.value)}
    error={error}
    id={FormFieldsIds.FRITEKST}
    label={label}
    maxLength={0}
    minLength={1}
    minRows={10}
  />
);
