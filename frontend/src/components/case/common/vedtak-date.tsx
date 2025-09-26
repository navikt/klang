import { FormFieldsIds } from '@app/components/case/common/form-fields-ids';
import { FORMAT } from '@app/components/date-picker/constants';
import { DatePicker } from '@app/components/date-picker/date-picker';
import type { ISODate } from '@app/domain/date/date';
import { useTranslation } from '@app/language/use-translation';
import type { CaseType } from '@app/redux-api/case/types';
import { format, isEqual, parse } from 'date-fns';
import { useState } from 'react';

interface VedtakDateProps {
  value: ISODate | null;
  type: CaseType;
  error: string | undefined;
  onChange: (value: ISODate | null) => void;
}

export const VedtakDate = ({ value, type, error, onChange }: VedtakDateProps) => {
  const { skjema } = useTranslation();
  const [date, setDate] = useState<Date | null>(value === null ? null : parse(value, FORMAT, new Date()));

  const onInternalChange = (newValue: Date | null) => {
    if (newValue === null && date === null) {
      return;
    }

    if (newValue !== null && date !== null && isEqual(newValue, date)) {
      return;
    }

    setDate(newValue);

    const formattedValue = newValue === null ? null : format(newValue, FORMAT);

    onChange(formattedValue);
  };

  return (
    <DatePicker
      id={FormFieldsIds.VEDTAK_DATE}
      onChange={onInternalChange}
      error={error}
      value={date}
      label={skjema.begrunnelse.vedtak_date.title[type]}
      size="medium"
    />
  );
};
