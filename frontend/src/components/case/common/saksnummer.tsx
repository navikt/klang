import { FormFieldsIds } from '@app/components/case/common/form-fields-ids';
import { useTranslation } from '@app/language/use-translation';
import { BodyShort, Heading, TextField } from '@navikt/ds-react';
import { useEffect, useState } from 'react';

interface UserSaksnummerProps {
  value: string | null;
  onChange: (saksnummer: string | null) => void;
  error: string | undefined;
  disabled?: boolean;
}

interface Props extends UserSaksnummerProps {
  internalSaksnummer: string | null;
}

interface DebouncedProps {
  isError: boolean;
  resetError: () => void;
  disabled: boolean;
}

const DebouncedUserSaksnummer = ({
  value,
  onChange,
  error,
  isError,
  resetError,
  disabled,
}: UserSaksnummerProps & DebouncedProps) => {
  const [localValue, setLocalValue] = useState(value);

  useEffect(() => {
    if (value === localValue || isError) {
      return;
    }

    const timeout = setTimeout(() => onChange(localValue), 1000);

    return () => clearTimeout(timeout);
  }, [onChange, value, localValue, isError]);

  return (
    <UserSaksnummer
      error={error}
      value={localValue}
      onChange={(v) => {
        setLocalValue(v);
        resetError();
      }}
      disabled={disabled}
    />
  );
};

const InternalSaksnummer = ({ internalSaksnummer }: { internalSaksnummer: string }) => {
  const { skjema } = useTranslation();

  if (typeof internalSaksnummer === 'string' && internalSaksnummer.length !== 0) {
    return (
      <section>
        <Heading size="xsmall">{skjema.begrunnelse.saksnummer.internalTitle}</Heading>
        <BodyShort>{internalSaksnummer}</BodyShort>
      </section>
    );
  }
};

const UserSaksnummer = ({ value, onChange, error, disabled }: UserSaksnummerProps) => {
  const { skjema } = useTranslation();

  return (
    <TextField
      id={FormFieldsIds.SAKSNUMMER}
      label={skjema.begrunnelse.saksnummer.title}
      value={value ?? ''}
      onChange={({ target }) => onChange(target.value)}
      htmlSize={24}
      error={error}
      disabled={disabled}
    />
  );
};

export const Saksnummer = ({ value, internalSaksnummer, onChange, error }: Props) => {
  if (typeof internalSaksnummer === 'string' && internalSaksnummer.length !== 0) {
    return <InternalSaksnummer internalSaksnummer={internalSaksnummer} />;
  }

  return <UserSaksnummer value={value} onChange={onChange} error={error} />;
};

export const DebouncedSaksnummer = ({ internalSaksnummer, ...props }: Props & DebouncedProps) => {
  if (typeof internalSaksnummer === 'string' && internalSaksnummer.length !== 0) {
    return <InternalSaksnummer internalSaksnummer={internalSaksnummer} />;
  }

  return <DebouncedUserSaksnummer {...props} />;
};
