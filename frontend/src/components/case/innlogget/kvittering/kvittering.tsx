import { InfoBox } from '@app/components/info-box/info-box';
import { ExternalLink } from '@app/components/link/external-link';
import { type ISODate, isoDateToPretty } from '@app/domain/date/date';
import { useUserRequired } from '@app/hooks/use-user';
import { Envelope } from '@app/icons/envelope';
import type { Innsendingsytelse } from '@app/innsendingsytelser/innsendingsytelser';
import { useTranslation } from '@app/language/use-translation';
import { AppEventEnum } from '@app/logging/action';
import { appEvent } from '@app/logging/logger';
import type { CaseType } from '@app/redux-api/case/types';
import { DownloadIcon } from '@navikt/aksel-icons';
import { BodyShort, Box, Heading, VStack } from '@navikt/ds-react';

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

      <InfoBox variant="success">
        <Heading spacing size="small" level="3">
          {skjema.kvittering.general_info.title}
        </Heading>
        <BodyShort>{skjema.kvittering.general_info.description(type, ytelse)}</BodyShort>
      </InfoBox>

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
  sakenGjelder: string;
}

export const Journalpost = ({ caseId, finalizedDate, basePath, type, sakenGjelder }: JournalpostProps) => {
  const { skjema } = useTranslation();
  const { data } = useUserRequired();

  return (
    <>
      {data !== undefined && data.folkeregisteridentifikator.identifikasjonsnummer === sakenGjelder ? (
        <BodyShort>
          <ExternalLink href={`${basePath}/${caseId}/pdf`} onClick={() => appEvent(AppEventEnum.CASE_DOWNLOAD)}>
            <DownloadIcon aria-hidden />
            <span>{skjema.kvittering.download[type]}</span>
          </ExternalLink>
        </BodyShort>
      ) : null}
      <BodyShort>
        {skjema.kvittering.sent}: {isoDateToPretty(finalizedDate)}
      </BodyShort>
    </>
  );
};
