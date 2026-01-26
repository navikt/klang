import { ExternalLink } from '@app/components/link/link';
import { type ISODate, isoDateToPretty } from '@app/domain/date/date';
import { Envelope } from '@app/icons/envelope';
import type { Innsendingsytelse } from '@app/innsendingsytelser/innsendingsytelser';
import { useTranslation } from '@app/language/use-translation';
import { AppEventEnum } from '@app/logging/action';
import { appEvent } from '@app/logging/logger';
import type { CaseType } from '@app/redux-api/case/types';
import { DownloadIcon } from '@navikt/aksel-icons';
import { Alert, BodyShort, Box, Heading, VStack } from '@navikt/ds-react';

interface Props {
  children?: React.ReactNode;
  type: CaseType;
  ytelse: Innsendingsytelse;
}

export const Kvittering = ({ children, type, ytelse }: Props) => {
  const { skjema, icons } = useTranslation();

  return (
    <>
      <VStack align="center">
        <Box marginInline="auto" marginBlock="space-0 space-16" width="100px">
          <Envelope title={icons.receipt} className="w-full" />
        </Box>
        <Heading align="center" level="2" size="medium">
          {skjema.kvittering.title[type]}
        </Heading>
      </VStack>

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
