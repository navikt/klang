import { StatusLoading } from '@app/components/case/innlogget/status/status-loading';
import { KlageTimeline } from '@app/components/case/innlogget/status/timeline/klage';
import { type ISODate, isoDateToPretty } from '@app/domain/date/date';
import { Envelope } from '@app/icons/envelope';
import { useTranslation } from '@app/language/use-translation';
import { AppEventEnum } from '@app/logging/action';
import { appEvent } from '@app/logging/logger';
import type { Case, CaseType } from '@app/redux-api/case/types';
import { API_PATH } from '@app/redux-api/common';
import { CenteredContainer } from '@app/styled-components/common';
import { DownloadIcon } from '@navikt/aksel-icons';
import { Alert, BodyShort, Heading } from '@navikt/ds-react';
import { useEffect, useState } from 'react';
import { styled } from 'styled-components';
import { ExternalLink } from '../../../link/link';

export const Status = (data: Case) => {
  const { type, innsendingsytelse } = data;
  const { skjema } = useTranslation();

  // TODO: Remove mock finalized date and destruct from data.
  const [finalizedDate, setFinalizedDate] = useState<ISODate | null>(null);
  useEffect(() => {
    setTimeout(() => {
      setFinalizedDate(data.finalizedDate);
    }, 10_000);
  }, [data.finalizedDate]);
  // End remove

  if (finalizedDate === null) {
    return (
      <>
        <StatusLoading type={type} />

        <KlageTimeline {...data} finalizedDate={finalizedDate} />

        <BodyShort>
          {skjema.status.read_more} {skjema.status.see_estimate}
        </BodyShort>
        <CenteredContainer>
          <ExternalLink href={skjema.status.dine_saker.url} openInSameWindow>
            {skjema.status.dine_saker.title}
          </ExternalLink>
        </CenteredContainer>
      </>
    );
  }

  return (
    <>
      <StatusSent type={type} />

      <Alert variant="success">
        <Heading spacing size="small" level="3">
          {skjema.status.general_info.title}
        </Heading>
        <BodyShort>{skjema.status.general_info.description(type, innsendingsytelse)}</BodyShort>
      </Alert>

      <KlageTimeline {...data} />

      <BodyShort>
        {skjema.status.read_more} {skjema.status.see_estimate}
      </BodyShort>
      <CenteredContainer>
        <ExternalLink href={skjema.status.dine_saker.url} openInSameWindow>
          {skjema.status.dine_saker.title}
        </ExternalLink>
      </CenteredContainer>
    </>
  );
};

interface StatusSentProps {
  type: CaseType;
}

const StatusSent = ({ type }: StatusSentProps) => {
  const { skjema, icons } = useTranslation();

  return (
    <div>
      <Icon title={icons.receipt} />
      <Heading level="2" size="medium" align="center">
        {skjema.status.title[type]}
      </Heading>
    </div>
  );
};

interface JournalpostProps {
  caseId: string;
  finalizedDate: ISODate | null;
  type: CaseType;
}

export const Journalpost = ({ caseId, finalizedDate, type }: JournalpostProps) => {
  const { skjema } = useTranslation();

  return (
    <>
      <BodyShort>
        <ExternalLink href={`${API_PATH}/klanker/${caseId}/pdf`} onClick={() => appEvent(AppEventEnum.CASE_DOWNLOAD)}>
          <DownloadIcon aria-hidden />
          <span>{skjema.status.download[type]}</span>
        </ExternalLink>
      </BodyShort>
      <BodyShort>
        {skjema.status.sent}: {isoDateToPretty(finalizedDate)}
      </BodyShort>
    </>
  );
};

const Icon = styled(Envelope)`
  display: block;
  margin-left: auto;
  margin-right: auto;
  margin-bottom: 16px;
  width: 100px;
`;
