import { TimelineItem } from '@app/components/case/innlogget/status/timeline/timeline-item';
import { useLanguage } from '@app/language/use-language';
import { useTranslation } from '@app/language/use-translation';
import { AppEventEnum } from '@app/logging/action';
import { appEvent } from '@app/logging/logger';
import type { Case } from '@app/redux-api/case/types';
import { API_PATH } from '@app/redux-api/common';
import {
  ExternalLinkIcon,
  FileParagraphIcon,
  InboxDownIcon,
  PersonEnvelopeIcon,
  PersonGavelIcon,
} from '@navikt/aksel-icons';
import { BodyShort, Button, Link, VStack } from '@navikt/ds-react';
import { addMonths, format, parse } from 'date-fns';

export const KlageTimeline = ({ id, type, innsendingsytelse, finalizedDate }: Case) => {
  const { skjema } = useTranslation();
  const lang = useLanguage();

  if (finalizedDate === null) {
    return (
      <VStack as="ul" gap="4" margin="0" padding="0">
        <TimelineItem
          title="Du sendte inn klagen"
          date={format(new Date(), 'yyyy-MM-dd')}
          icon={<PersonEnvelopeIcon fontSize={24} />}
        >
          <VStack gap="2">
            <BodyShort>Sender inn klagen...</BodyShort>

            <Button
              as="a"
              variant="secondary"
              size="medium"
              href={`${API_PATH}/klanker/${id}/pdf`}
              target="_blank"
              onClick={() => appEvent(AppEventEnum.CASE_DOWNLOAD)}
              icon={<ExternalLinkIcon aria-hidden />}
            >
              {skjema.status.download[type]}
            </Button>
          </VStack>
        </TimelineItem>
      </VStack>
    );
  }

  return (
    <VStack as="ul" gap="4" margin="0" padding="0">
      <TimelineItem
        title="Du sendte inn klagen"
        text="Klagen ble sendt inn."
        date={finalizedDate}
        icon={<PersonEnvelopeIcon fontSize={24} />}
      >
        <Button
          as="a"
          variant="secondary"
          size="medium"
          href={`${API_PATH}/klanker/${id}/pdf`}
          target="_blank"
          onClick={() => appEvent(AppEventEnum.CASE_DOWNLOAD)}
          icon={<ExternalLinkIcon aria-hidden />}
        >
          {skjema.status.download[type]}
        </Button>
      </TimelineItem>

      <TimelineItem
        title="Klagen din ble mottatt av Nav Klageinstans"
        text={
          <>
            Har du glemt å sende med noe kan du ettersende dokumentasjon her, eller gå via{' '}
            <Link href="https://www.nav.no/klage">nav.no/klage</Link> og trykke på "Ettersend dokumentasjon" for det
            saken gjelder.
          </>
        }
        date={finalizedDate}
        icon={<InboxDownIcon fontSize={24} />}
      >
        <Button
          as="a"
          variant="secondary"
          size="medium"
          href={`/${lang}/ettersendelse/${type.toLowerCase()}/${innsendingsytelse.toLowerCase()}?saksnummer=${id}`}
          target="_blank"
        >
          Ettersend dokumentasjon
        </Button>
      </TimelineItem>

      <TimelineItem
        title="Klagen din ble ferdig behandlet av Nav Klageinstans"
        date={format(addMonths(parse(finalizedDate, 'yyyy-MM-dd', new Date()), 6), 'yyyy-MM-dd')}
        icon={<PersonGavelIcon fontSize={24} />}
        text="Nav Klageinstans har behandlet klagen din og sendt saken tilbake til Nav for videre oppfølging."
      >
        <Button as="a" variant="secondary" size="medium" href={`${API_PATH}/klanker/${id}/pdf`} target="_blank">
          Se vedtak på klagen
        </Button>
      </TimelineItem>

      <TimelineItem
        title="Vil du anke?"
        date={format(addMonths(parse(finalizedDate, 'yyyy-MM-dd', new Date()), 7), 'yyyy-MM-dd')}
        icon={<FileParagraphIcon fontSize={24} />}
        text="Vil du anke, så må du forte deg å gjøre det innen fristen."
      >
        <Button
          as="a"
          variant="primary"
          size="medium"
          href={`/${lang}/anke/${innsendingsytelse.toLowerCase()}?saksnummer=${id}`}
          target="_blank"
        >
          Send inn anke på klagevedtaket
        </Button>
      </TimelineItem>

      <TimelineItem
        title="Vedtak på anke"
        icon={<FileParagraphIcon fontSize={24} />}
        text="Du vil motta brev fra Nav klageinstans med vedtak på anken."
      />
    </VStack>
  );
};
