import { PostFormContainer } from '@app/components/case/common/post/post-form-container';
import { PersonligeOpplysningerSummary } from '@app/components/case/common/summary/personlige-opplysninger-summary';
import { VedtakSummary } from '@app/components/case/common/summary/vedtak-summary';
import { useSessionCase } from '@app/components/case/uinnlogget/session-case-context';
import { DownloadButton } from '@app/components/case/uinnlogget/summary/download-button';
import { InformationPointBox } from '@app/components/information-point-box/information-point-box';
import { useGoToBegrunnelseOnError } from '@app/hooks/errors/use-navigate-on-error';
import { useSessionCaseErrors } from '@app/hooks/errors/use-session-case-errors';
import { Clipboard } from '@app/icons/clipboard';
import { useTranslation } from '@app/language/use-translation';
import { Section } from '@app/styled-components/summary';
import { getLoginRedirectPath } from '@app/user/login';
import { EnterIcon } from '@navikt/aksel-icons';
import {
  Alert,
  BodyLong,
  BodyShort,
  Box,
  Button,
  Checkbox,
  CheckboxGroup,
  CopyButton,
  Dialog,
  Heading,
  HStack,
  VStack,
} from '@navikt/ds-react';
import { useState } from 'react';
import { Link } from 'react-router';

const UNDERSTOOD_VALUE = 'understood';

export const SessionCaseOppsummeringPage = () => {
  const { type, innsendingsytelse, sessionCase: data } = useSessionCase();
  const { common, skjema, icons, error_messages } = useTranslation();
  const validate = useSessionCaseErrors(type);
  const [isValid] = validate(data);
  const [isUnderstood, setIsUnderstood] = useState(false);
  const [isUnderstoodError, setIsUnderstoodError] = useState<string | null>(null);
  const [downloadError, setDownloadError] = useState<boolean>(false);

  const showIsUnderstoodError = isUnderstoodError !== null;

  useGoToBegrunnelseOnError(isValid);

  const { title_fragment, page_title } = skjema.common;

  const saksnummer = data.internalSaksnummer ?? data.userSaksnummer;

  return (
    <PostFormContainer
      innsendingsytelse={innsendingsytelse}
      activeStep={2}
      isValid={isValid}
      steps={skjema.steps[type]}
      title_fragment={title_fragment[type]}
      page_title={page_title[type]}
    >
      <VStack align="center">
        <Box marginInline="auto" marginBlock="space-0 space-16" width="100px">
          <Clipboard title={icons.summary} className="w-full" />
        </Box>
        <Heading align="center" level="2" size="medium">
          {skjema.summary.title.not_logged_in}
        </Heading>
      </VStack>

      <VStack asChild gap="space-16">
        <Box padding="space-16" borderWidth="1" borderRadius="12">
          <Section>
            <Heading level="1" size="small" spacing>
              {skjema.summary.sections.person.title}
            </Heading>
            <PersonligeOpplysningerSummary {...data.navn} f_or_d_number={data.foedselsnummer} />
          </Section>

          <Section>
            <Heading level="1" size="small" spacing>
              {skjema.summary.sections.case.title}
            </Heading>
            <VedtakSummary {...data} type={type} />
          </Section>

          <Section>
            <Heading level="1" size="small" spacing>
              {skjema.summary.sections.begrunnelse.title[type]}
            </Heading>
            <VStack gap="space-16">
              <InformationPointBox header={skjema.summary.sections.begrunnelse.why[type]}>
                <BodyLong className="wrap-break-word whitespace-pre-wrap">
                  {data.fritekst.length === 0 ? common.not_specified : data.fritekst}
                </BodyLong>
              </InformationPointBox>
            </VStack>
          </Section>

          <Section>
            <Heading level="1" size="small" spacing>
              {skjema.summary.sections.begrunnelse.documents}
            </Heading>
            <BodyShort>{data.hasVedlegg ? common.yes : common.no}</BodyShort>
          </Section>
        </Box>
      </VStack>

      <Alert variant="info">
        <BodyShort spacing>{skjema.summary.sections.login.notice[type]}</BodyShort>
        <BodyShort spacing>{common.login_copy_reminder}</BodyShort>

        <Dialog>
          <Dialog.Trigger>
            <Button>{skjema.summary.sections.login.action}</Button>
          </Dialog.Trigger>

          <Dialog.Popup>
            <Dialog.Header>
              <Dialog.Title>{skjema.summary.sections.login.action}</Dialog.Title>
            </Dialog.Header>

            <Dialog.Body>
              <BodyLong spacing>{common.login_copy_reminder}</BodyLong>
              <CopyButton text={skjema.summary.sections.begrunnelse.title[type]} copyText={data.fritekst} />
              {saksnummer === null ? null : (
                <CopyButton text={skjema.summary.sections.case.saksnummer} copyText={saksnummer} />
              )}
              {data.vedtakDate === null || data.vedtakDate.length === 0 ? null : (
                <CopyButton text={skjema.summary.sections.case.vedtak[type]} copyText={data.vedtakDate} />
              )}
            </Dialog.Body>

            <Dialog.Footer>
              <Dialog.CloseTrigger>
                <Button variant="secondary">{common.cancel}</Button>
              </Dialog.CloseTrigger>

              <Button
                variant="primary"
                size="medium"
                as="a"
                href={getLoginRedirectPath()}
                icon={<EnterIcon aria-hidden />}
              >
                {skjema.summary.sections.login.action}
              </Button>
            </Dialog.Footer>
          </Dialog.Popup>
        </Dialog>
      </Alert>

      <Box
        background={showIsUnderstoodError ? 'danger-moderate' : 'warning-moderate'}
        borderColor={showIsUnderstoodError ? 'danger-strong' : 'warning-strong'}
        borderRadius="12"
        borderWidth="1"
        padding="space-16"
      >
        <CheckboxGroup
          value={isUnderstood ? [UNDERSTOOD_VALUE] : []}
          onChange={(checked: string[]) => setIsUnderstood(checked.includes(UNDERSTOOD_VALUE))}
          error={isUnderstoodError}
          hideLegend
          legend={skjema.summary.sections.confirm.legend}
        >
          <Checkbox value={UNDERSTOOD_VALUE} error={showIsUnderstoodError}>
            {skjema.summary.sections.confirm.label[type]}
          </Checkbox>
        </CheckboxGroup>
      </Box>

      <VStack align="center" gap="space-16">
        <HStack align="center" justify="center" gap="space-16">
          <Button as={Link} variant="secondary" to="../begrunnelse">
            {common.back}
          </Button>

          <DownloadButton
            validForm={() => {
              if (isUnderstood) {
                setIsUnderstoodError(null);

                return true;
              }

              setIsUnderstoodError(skjema.summary.sections.confirm.error[type]);

              return false;
            }}
            onError={() => setDownloadError(true)}
            error={downloadError}
          />
        </HStack>

        {downloadError ? (
          <Alert size="small" variant="error" aria-live="polite" id="download-error">
            {error_messages.download}
          </Alert>
        ) : null}
      </VStack>
    </PostFormContainer>
  );
};
