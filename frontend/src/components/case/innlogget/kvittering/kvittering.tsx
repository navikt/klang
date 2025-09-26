import { ExternalLink } from '@app/components/link/link';
import { type ISODate, isoDateToPretty } from '@app/domain/date/date';
import { Envelope } from '@app/icons/envelope';
import type { Innsendingsytelse } from '@app/innsendingsytelser/innsendingsytelser';
import { useTranslation } from '@app/language/use-translation';
import { AppEventEnum } from '@app/logging/action';
import { appEvent } from '@app/logging/logger';
import type { CaseType } from '@app/redux-api/case/types';
import { CenteredHeading } from '@app/styled-components/page-title';
import { DownloadIcon } from '@navikt/aksel-icons';
import { Alert, BodyShort, Heading } from '@navikt/ds-react';
import { styled } from 'styled-components';

interface Props {
  children?: React.ReactNode;
  type: CaseType;
  ytelse: Innsendingsytelse;
}

export const Kvittering = ({ children, type, ytelse }: Props) => {
  const { skjema, icons } = useTranslation();

  return (
    <>
      <div>
        <Icon title={icons.receipt} />
        <CenteredHeading level="2" size="medium">
          {skjema.kvittering.title[type]}
        </CenteredHeading>
      </div>

      {children}

      <Alert variant="success">
        <Heading spacing size="small" level="3">
          {skjema.kvittering.general_info.title}
        </Heading>
        <BodyShort>{skjema.kvittering.general_info.description(type, ytelse)}</BodyShort>
      </Alert>

      <BodyShort>
        {skjema.kvittering.read_more} {skjema.kvittering.see_estimate}
      </BodyShort>
    </>
  );
};

interface JournalpostProps {
  caseId: string;
  finalizedDate: ISODate | null;
  basePath: string;
  type: CaseType;
}

export const Journalpost = ({ caseId, finalizedDate, basePath, type }: JournalpostProps) => {
  const { skjema } = useTranslation();

  return (
    <>
      <BodyShort>
        <ExternalLink href={`${basePath}/${caseId}/pdf`} onClick={() => appEvent(AppEventEnum.CASE_DOWNLOAD)}>
          <DownloadIcon aria-hidden />
          <span>{skjema.kvittering.download[type]}</span>
        </ExternalLink>
      </BodyShort>
      <BodyShort>
        {skjema.kvittering.sent}: {isoDateToPretty(finalizedDate)}
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
