import { useTranslation } from '@app/language/use-translation';
import { HStack, Radio, RadioGroup } from '@navikt/ds-react';

interface Props {
  caseIsAtKA: boolean | null;
  onIsAtKaChange: (caseIsAtKA: boolean) => void;
  error: string | undefined;
}

export const EttersendelseKaEnhet = ({ caseIsAtKA, onIsAtKaChange, error }: Props) => {
  const { skjema, common } = useTranslation();

  return (
    <RadioGroup
      legend={skjema.begrunnelse.klageenhet.radio_title}
      onChange={(v) => onIsAtKaChange(v === YES)}
      value={toValue(caseIsAtKA)}
      error={error}
    >
      <HStack gap="space-16">
        <Radio value={YES}>{common.yes}</Radio>
        <Radio value={NO}>{common.no}</Radio>
      </HStack>
    </RadioGroup>
  );
};

const YES = 'true';
const NO = 'false';

const toValue = (value: boolean | null) => {
  if (value === null) {
    return undefined;
  }

  return value ? YES : NO;
};
