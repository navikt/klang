import { useTranslation } from '@app/language/use-translation';
import { Radio, RadioGroup } from '@navikt/ds-react';
import { styled } from 'styled-components';

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
      <HorizontalOptions>
        <Radio value={YES}>{common.yes}</Radio>
        <Radio value={NO}>{common.no}</Radio>
      </HorizontalOptions>
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

const HorizontalOptions = styled.div`
  display: flex;
  gap: 16px;
`;
