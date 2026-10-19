import { displayFnr } from '@app/functions/display';
import { isApiError } from '@app/functions/is-api-error';
import { useUserRequired } from '@app/hooks/use-user';
import { useLanguage } from '@app/language/use-language';
import { useTranslation } from '@app/language/use-translation';
import { useResumeOrCreateCaseMutation } from '@app/redux-api/case/api';
import type { Case } from '@app/redux-api/case/types';
import { Radio, RadioGroup } from '@navikt/ds-react';
import { useState } from 'react';
import { useNavigate } from 'react-router';

interface Props {
  case: Case;
}

export const SelectSakenGjelder = ({
  case: {
    innsendingsytelse,
    type,
    fullmaktsgivere,
    sakenGjelder,
    internalSaksnummer,
    caseIsAtKA,
    sakSakstype,
    sakFagsaksystem,
  },
}: Props) => {
  const { data } = useUserRequired();
  const [resumeOrCreate, { isLoading }] = useResumeOrCreateCaseMutation({
    fixedCacheKey: data?.folkeregisteridentifikator.identifikasjonsnummer,
  });
  const language = useLanguage();
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const { skjema } = useTranslation();

  const { fullmakt } = skjema.begrunnelse;

  if (data === undefined) {
    return null;
  }

  if (fullmaktsgivere.length === 0) {
    return null;
  }

  return (
    <RadioGroup
      legend={fullmakt.saken_gjelder}
      value={sakenGjelder}
      disabled={isLoading}
      error={error}
      onChange={async (v) => {
        setError(null);

        try {
          const { id } = await resumeOrCreate({
            sakenGjelder: v,
            type,
            innsendingsytelse,
            internalSaksnummer,
            caseIsAtKA,
            sakSakstype,
            sakFagsaksystem,
          }).unwrap();

          navigate({ pathname: `/${language}/sak/${id}/begrunnelse` });
        } catch (e) {
          setError(isApiError(e) ? e.data.detail : fullmakt.set_saken_gjelder_error);
        }
      }}
    >
      <Radio value={data.folkeregisteridentifikator.identifikasjonsnummer}>{fullmakt.me}</Radio>

      {fullmaktsgivere.map(({ navn, folkeregisteridentifikator: { identifikasjonsnummer } }) => (
        <Radio key={identifikasjonsnummer} value={identifikasjonsnummer}>
          {fullmakt.fullmakt}: {navn.etternavn}, {navn.fornavn} ({displayFnr(identifikasjonsnummer)})
        </Radio>
      ))}
    </RadioGroup>
  );
};
