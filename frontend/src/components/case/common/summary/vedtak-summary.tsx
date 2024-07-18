import { BodyShort } from '@navikt/ds-react';
import { useMemo } from 'react';
import { ISessionCase } from '@app/components/case/uinnlogget/types';
import { ISODate, isoDateToPretty } from '@app/domain/date/date';
import { useTranslation } from '@app/language/use-translation';
import { Case } from '@app/redux-api/case/types';
import { SpaceBetweenFlexListContainer } from '@app/styled-components/common';
import { InformationPointBox } from '../../../information-point-box/information-point-box';

export const VedtakSummary = ({ vedtakDate, internalSaksnummer, userSaksnummer, type }: Case | ISessionCase) => {
  const { skjema, common } = useTranslation();

  return (
    <SpaceBetweenFlexListContainer>
      <Saksnummer userSaksnummer={userSaksnummer} internalSaksnummer={internalSaksnummer} />
      <InformationPointBox header={skjema.summary.sections.case.vedtak[type]}>
        <BodyShort>{useDateToVedtakText(vedtakDate, common.not_specified)}</BodyShort>
      </InformationPointBox>
    </SpaceBetweenFlexListContainer>
  );
};

interface SaksnummerTextProps {
  userSaksnummer?: string | null;
  internalSaksnummer?: string | null;
}

const SaksnummerText = ({ internalSaksnummer = null, userSaksnummer = null }: SaksnummerTextProps) => {
  const { skjema, common } = useTranslation();

  if (typeof userSaksnummer === 'string' && userSaksnummer.length !== 0) {
    return <BodyShort>{userSaksnummer}</BodyShort>;
  }

  if (internalSaksnummer !== null) {
    return <BodyShort>{`${internalSaksnummer} \u2013 ${skjema.summary.sections.case.from_system}`}</BodyShort>;
  }

  return <BodyShort>{common.not_specified}</BodyShort>;
};

const Saksnummer = (props: SaksnummerTextProps) => {
  const { skjema } = useTranslation();

  return (
    <InformationPointBox header={skjema.summary.sections.case.saksnummer}>
      <SaksnummerText {...props} />
    </InformationPointBox>
  );
};

const useDateToVedtakText = (isoDate: ISODate | null, noDateText: string): string =>
  useMemo(() => {
    const prettyDate = isoDateToPretty(isoDate);

    if (prettyDate === null) {
      return noDateText;
    }

    return prettyDate;
  }, [isoDate, noDateText]);
